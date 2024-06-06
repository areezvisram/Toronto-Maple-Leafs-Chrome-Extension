package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"sync"
	"tml-extension-server/httpclient"
	"tml-extension-server/models"
	"tml-extension-server/processors"
	"tml-extension-server/utils"
)

func HandleNextGameProxy(url1, url2 string, client httpclient.HttpClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Request made for NHL schedule")

		var wg sync.WaitGroup
		responses := make(chan []byte, 2)
		errors := make(chan error, 2)

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

			body, err := utils.ReadAndProcessResponse(resp, processor)
			if err != nil {
				errors <- err
				return
			}

			responses <- body
		}

		wg.Add(2)
		go fetchAndProcess(url1, processors.NHLGameProcessor)
		go fetchAndProcess(url2, processors.PlayerStatsProcessor)

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

			if strings.Contains(string(response), "games") {
				if err := json.Unmarshal(response, &games); err == nil {
					combinedResponse.Games = games.Games
					log.Println("Successfully unmarshaled into FilteredResponse")
					continue
				}
			}

			if strings.Contains(string(response), "playerStats") {
				if err := json.Unmarshal(response, &playerStats); err == nil {
					combinedResponse.PlayerStats = playerStats.PlayersStats
					log.Println("Successfully unmarshaled into FilteredPlayerStatsResponse")
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
