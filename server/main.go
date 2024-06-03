package main

import (
	"log"
	"net/http"
	"tml-extension-server/handler"
	"tml-extension-server/httpclient"
)

func main() {
	http.HandleFunc("/api/nhl-schedule", handler.HandleNextGameProxy("https://api-web.nhle.com/v1/club-schedule/EDM/week/now", &httpclient.DefaultHttpClient{}))
	log.Println("Starting proxy server on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
