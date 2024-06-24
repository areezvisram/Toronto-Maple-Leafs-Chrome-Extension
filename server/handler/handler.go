package handler

import (
	"compress/gzip"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"sync"
	"tml-extension-server/httpclient"
	"tml-extension-server/models"
	"tml-extension-server/processors"
	"tml-extension-server/utils"
)

func HandleNextGameProxy(url1, url2, url3 string, client httpclient.HttpClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Request made for NHL schedule")

		utils.EnableCors(&w)

		var wg sync.WaitGroup
		responses := make(chan []byte, 3)
		errors := make(chan error, 3)

		fetchAndProcess := func(url string, processor utils.ResponseProcessor) {
			defer wg.Done()

			req, err := utils.CreateRequest(r.Method, url, r.Header)
			if err != nil {
				errors <- err
				return
			}

			resp, err := client.Do(req)
			if err != nil {
				errors <- err
				return
			}

			body, err := utils.ReadAndProcessResponse(resp, func(body []byte) ([]byte, error) {
				return processor(body)
			})
			if err != nil {
				errors <- err
				return
			}

			responses <- body
		}

		wg.Add(3)
		go fetchAndProcess(url1, processors.NHLGameProcessor)
		go fetchAndProcess(url2, processors.PlayerStatsProcessor)
		go fetchAndProcess(url3, processors.GoalieStatsProcessor)

		wg.Wait()
		close(responses)
		close(errors)

		if len(errors) > 0 {
			for err := range errors {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			return
		}

		var combinedResponse models.CombinedPlayersAndGamesResponse
		for response := range responses {
			var games models.FilteredResponse
			var playerStats models.FilteredPlayerStatsResponse
			var goalieStats models.FilteredGoalieStatsResponse

			if strings.Contains(string(response), "previousGame") || strings.Contains(string(response), "nextGame") {
				if err := json.Unmarshal(response, &games); err == nil {
					combinedResponse.PreviousGame = games.PreviousGame
					combinedResponse.NextGame = games.NextGame
					combinedResponse.PreviousStartDate = games.PreviousStartDate
				}

				// Fetch previous game if required
				if combinedResponse.PreviousGame.GameDate == "" {
					var nextGameResponse models.NextGameResponse
					if err := json.Unmarshal(response, &nextGameResponse); err == nil {
						previousGame, err := getPreviousGame(client, nextGameResponse.PreviousStartDate)
						if err != nil {
							http.Error(w, err.Error(), http.StatusInternalServerError)
							return
						}
						combinedResponse.PreviousGame = previousGame
					}
				}
				continue
			}

			if strings.Contains(string(response), "playerStats") {
				if err := json.Unmarshal(response, &playerStats); err == nil {
					combinedResponse.PlayerStats = playerStats.PlayersStats
					continue
				}
			}

			if strings.Contains(string(response), "goalieStats") {
				if err := json.Unmarshal(response, &goalieStats); err == nil {
					combinedResponse.GoalieStats = goalieStats.GoalieStats
					continue
				}
			}

			log.Printf("Failed to unmarshal response: %s", string(response))
		}

		combinedResponseJSON, err := json.Marshal(combinedResponse)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(combinedResponseJSON)
	}
}

func HandleStandingsProxy(url string, client httpclient.HttpClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Request made for NHL standings")

		utils.EnableCors(&w)

		req, err := utils.CreateRequest(r.Method, url, r.Header)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		resp, err := client.Do(req)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if err := utils.CopyResponse(w, resp, processors.StandingsProcessor); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

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
	// if len(previousGameResponse.Games) == 0 {
	// 	return models.FilteredGame{}, fmt.Errorf("no previous games found")
	// }

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
