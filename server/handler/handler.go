package handler

import (
	"compress/gzip"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"tml-extension-server/cache"
	"tml-extension-server/httpclient"
	"tml-extension-server/models"
	"tml-extension-server/utils"
)

func HandleNextGameProxy() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Request made for NHL schedule")

		utils.EnableCors(&w)

		cacheItem, found := cache.GetCacheItem("nhl_schedule_combined")
		if !found {
			http.Error(w, "Cache not found for NHL schedule", http.StatusInternalServerError)
			return
		}

		log.Println("Serving data from cache for schedule")
		w.Header().Set("Content-Type", "application/json")
		w.Write(cacheItem.Data)
	}
}

func HandleStandingsProxy() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Request made for NHL standings")

		utils.EnableCors(&w)

		cacheItem, found := cache.GetCacheItem("nhl_standings")
		if !found {
			http.Error(w, "Cache not found for NHL standings", http.StatusInternalServerError)
			return
		}

		log.Println("Serving data from cache for standings")
		w.Header().Set("Content-Type", "application/json")
		w.Write(cacheItem.Data)
	}
}

func getPreviousGame(client httpclient.HttpClient, previousStartDate string) (models.FilteredPreviousGame, error) {
	url := fmt.Sprintf("https://api-web.nhle.com/v1/club-schedule/EDM/week/%s", previousStartDate)
	log.Println("Fetching previous game from URL:", url)

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

	// TODO: Assuming the last game in the response is the previous game
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
