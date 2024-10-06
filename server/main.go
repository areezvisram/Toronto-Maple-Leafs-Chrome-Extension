package main

import (
	"log"
	"net/http"
	"tml-extension-server/cache"
	"tml-extension-server/constants"
	"tml-extension-server/handler"
	"tml-extension-server/httpclient"
	"tml-extension-server/processors"
	"tml-extension-server/utils"
)

// func main() {
// 	http.HandleFunc("/api/nhl-schedule", handler.HandleNextGameProxy(constants.NHL_SCHEDULE_URL, constants.PLAYER_STATS_URL, constants.GOALIE_STATS_URL, &httpclient.DefaultHttpClient{}))
// 	http.HandleFunc("/api/standings", handler.HandleStandingsProxy(constants.STANDINGS_URL, &httpclient.DefaultHttpClient{}))
// 	log.Println("Starting proxy server on port 8080")
// 	log.Fatal(http.ListenAndServe(":8080", nil))
// }

func main() {
	// Initialize cache
	cache.UpdateCache(
		[]string{constants.NHL_SCHEDULE_URL, constants.PLAYER_STATS_URL, constants.GOALIE_STATS_URL},
		&httpclient.DefaultHttpClient{},
		[]utils.ResponseProcessor{processors.NHLGameProcessor, processors.PlayerStatsProcessor, processors.GoalieStatsProcessor},
		"nhl_schedule_combined",
	)
	cache.UpdateStandingsCache(constants.STANDINGS_URL, &httpclient.DefaultHttpClient{}, processors.StandingsProcessor, "nhl_standings")

	// Schedule cache updates
	cache.ScheduleCacheUpdates()

	http.HandleFunc("/api/nhl-schedule", handler.HandleNextGameProxy())
	http.HandleFunc("/api/standings", handler.HandleStandingsProxy())
	log.Println("Starting proxy server on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
