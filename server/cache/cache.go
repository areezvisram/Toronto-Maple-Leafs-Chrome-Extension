package cache

import (
	"compress/gzip"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"strings"
	"sync"
	"time"
	"tml-extension-server/constants"
	"tml-extension-server/httpclient"
	"tml-extension-server/models"
	"tml-extension-server/processors"
	"tml-extension-server/utils"

	"github.com/robfig/cron/v3"
)

type CacheItem struct {
	Data      []byte
	UpdatedAt time.Time
}

var (
	cacheMap = make(map[string]CacheItem)
	mutex    sync.RWMutex
)

func UpdateCache(urls []string, client httpclient.HttpClient, processors []utils.ResponseProcessor, cacheKey string) {
	var combinedResponse models.CombinedPlayersAndGamesResponse

	for i, url := range urls {
		req, err := utils.CreateRequest("GET", url, nil)
		if err != nil {
			log.Printf("Error creating request for URL %s: %v", url, err)
			return
		}
		resp, err := client.Do(req)
		if err != nil {
			log.Printf("Error making request for URL %s: %v", url, err)
			return
		}
		defer resp.Body.Close()

		body, err := utils.ReadAndProcessResponse(resp, processors[i])
		if err != nil {
			log.Printf("Error processing response for URL %s: %v", url, err)
			return
		}

		// Unmarshal the processed data and combine it
		if i == 0 {
			var games models.FilteredResponse
			if err := json.Unmarshal(body, &games); err == nil {
				combinedResponse.PreviousGame = games.PreviousGame
				combinedResponse.NextGame = games.NextGame
				combinedResponse.PreviousStartDate = games.PreviousStartDate
			}
		} else if i == 1 {
			var playerStats models.FilteredPlayerStatsResponse
			if err := json.Unmarshal(body, &playerStats); err == nil {
				combinedResponse.PlayerStats = playerStats.PlayersStats
			}
		} else if i == 2 {
			var goalieStats models.FilteredGoalieStatsResponse
			if err := json.Unmarshal(body, &goalieStats); err == nil {
				combinedResponse.GoalieStats = goalieStats.GoalieStats
			}
		}
	}

	// Fetch and process the previous game if not already in combinedResponse
	if combinedResponse.PreviousGame.GameDate == "" {
		previousGame, err := getPreviousGame(client, combinedResponse.PreviousStartDate)
		if err != nil {
			log.Printf("Error fetching previous game: %v", err)
			return
		}
		combinedResponse.PreviousGame = previousGame
	}

	combinedResponseJSON, err := json.Marshal(combinedResponse)
	if err != nil {
		log.Printf("Error marshalling combined response: %v", err)
		return
	}

	mutex.Lock()
	cacheMap[cacheKey] = CacheItem{Data: combinedResponseJSON, UpdatedAt: time.Now()}
	mutex.Unlock()
}

func getPreviousGame(client httpclient.HttpClient, previousStartDate string) (models.FilteredPreviousGame, error) {
	url := fmt.Sprintf("https://api-web.nhle.com/v1/club-schedule/TOR/week/%s", previousStartDate)

	req, err := utils.CreateRequest("GET", url, nil)
	if err != nil {
		return models.FilteredPreviousGame{}, err
	}

	resp, err := client.Do(req)
	if err != nil {
		return models.FilteredPreviousGame{}, err
	}
	defer resp.Body.Close()

	var reader io.Reader
	if strings.Contains(resp.Header.Get("Content-Encoding"), "gzip") {
		gzipReader, err := gzip.NewReader(resp.Body)
		if err != nil {
			return models.FilteredPreviousGame{}, err
		}
		defer gzipReader.Close()
		reader = gzipReader
	} else {
		reader = resp.Body
	}

	body, err := io.ReadAll(reader)
	if err != nil {
		return models.FilteredPreviousGame{}, err
	}

	var previousGameResponse models.NextGameResponse
	if err := json.Unmarshal(body, &previousGameResponse); err != nil {
		return models.FilteredPreviousGame{}, err
	}

	if len(previousGameResponse.Games) == 0 {
		return models.FilteredPreviousGame{}, fmt.Errorf("no previous games found")
	}

	lastGame := previousGameResponse.Games[len(previousGameResponse.Games)-1]
	previousGame := models.FilteredPreviousGame{
		GameDate:      lastGame.GameDate,
		AwayTeam:      lastGame.AwayTeam.PlaceName.Default,
		HomeTeam:      lastGame.HomeTeam.PlaceName.Default,
		AwayTeamLogo:  lastGame.AwayTeam.Logo,
		HomeTeamLogo:  lastGame.HomeTeam.Logo,
		AwayTeamScore: lastGame.AwayTeam.Score,
		HomeTeamScore: lastGame.HomeTeam.Score,
	}

	return previousGame, nil
}

func UpdateStandingsCache(url string, client httpclient.HttpClient, processor utils.ResponseProcessor, cacheKey string) {
	req, err := utils.CreateRequest("GET", url, nil)
	if err != nil {
		log.Printf("Error creating request for URL %s: %v", url, err)
		return
	}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error making request for URL %s: %v", url, err)
		return
	}
	defer resp.Body.Close()

	body, err := utils.ReadAndProcessResponse(resp, processor)
	if err != nil {
		log.Printf("Error processing response for URL %s: %v", url, err)
		return
	}

	mutex.Lock()
	cacheMap[cacheKey] = CacheItem{Data: body, UpdatedAt: time.Now()}
	mutex.Unlock()
}

func ScheduleCacheUpdates() {
	loc, _ := time.LoadLocation("America/Toronto")
	c := cron.New(cron.WithLocation(loc))
	_, err := c.AddFunc("0 3 * * *", func() {
		log.Println("Updating cache, requests being made to NHL API")
		UpdateCache(
			[]string{constants.NHL_SCHEDULE_URL, constants.PLAYER_STATS_URL, constants.GOALIE_STATS_URL},
			&httpclient.DefaultHttpClient{},
			[]utils.ResponseProcessor{processors.NHLGameProcessor, processors.PlayerStatsProcessor, processors.GoalieStatsProcessor},
			"nhl_schedule_combined",
		)
		UpdateStandingsCache(constants.STANDINGS_URL, &httpclient.DefaultHttpClient{}, processors.StandingsProcessor, "nhl_standings")
	})

	if err != nil {
		log.Fatal("Error scheduling cache updates: ", err)
	}

	c.Start()
}

func GetCacheItem(cacheKey string) (CacheItem, bool) {
	mutex.RLock()
	defer mutex.RUnlock()
	cacheItem, found := cacheMap[cacheKey]
	return cacheItem, found
}
