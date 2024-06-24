package main

import (
	"log"
	"net/http"
	"tml-extension-server/constants"
	"tml-extension-server/handler"
	"tml-extension-server/httpclient"
)

func main() {
	http.HandleFunc("/api/nhl-schedule", handler.HandleNextGameProxy(constants.NHL_SCHEDULE_URL, constants.PLAYER_STATS_URL, constants.GOALIE_STATS_URL, &httpclient.DefaultHttpClient{}))
	http.HandleFunc("/api/standings", handler.HandleStandingsProxy(constants.STANDINGS_URL, &httpclient.DefaultHttpClient{}))
	log.Println("Starting proxy server on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
