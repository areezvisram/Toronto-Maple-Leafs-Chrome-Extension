package main

import (
	"compress/gzip"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"
)

type Team struct {
	PlaceName struct {
		Default string `json:"default"`
	} `json:"placeName"`
	Logo string `json:"logo"`
}

type Game struct {
	GameDate string `json:"gameDate"`
	AwayTeam Team   `json:"awayTeam"`
	HomeTeam Team   `json:"homeTeam"`
}

type NextGameResponse struct {
	Games []Game `json:"games"`
}

type FilteredGame struct {
	GameDate     string `json:"gameDate"`
	AwayTeam     string `json:"awayTeam"`
	HomeTeam     string `json:"homeTeam"`
	AwayTeamLogo string `json:"awayTeamLogo"`
	HomeTeamLogo string `json:"homeTeamLogo"`
}

type FilteredResponse struct {
	Games []FilteredGame `json:"games"`
}

type DefaultHttpClient struct{}

func (c *DefaultHttpClient) Do(req *http.Request) (*http.Response, error) {
	return http.DefaultClient.Do(req)
}

func createRequest(method, url string, header http.Header) (*http.Request, error) {
	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		return nil, err
	}

	for k, v := range header {
		req.Header[k] = v
	}

	return req, nil
}

func copyResponse(w http.ResponseWriter, resp *http.Response) {
	defer resp.Body.Close()

	var reader io.Reader
	if strings.Contains(resp.Header.Get("Content-Encoding"), "gzip") {
		gzipReader, err := gzip.NewReader(resp.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer gzipReader.Close()
		reader = gzipReader
	} else {
		reader = resp.Body
	}

	// Read the response body
	body, err := io.ReadAll(reader)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Unmarshal the response body into the NextGameResponse struct
	var nextGameResponse NextGameResponse
	if err := json.Unmarshal(body, &nextGameResponse); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Filter the data
	var filteredResponse FilteredResponse
	for _, game := range nextGameResponse.Games {
		filteredGame := FilteredGame{
			GameDate:     game.GameDate,
			AwayTeam:     game.AwayTeam.PlaceName.Default,
			HomeTeam:     game.HomeTeam.PlaceName.Default,
			AwayTeamLogo: game.AwayTeam.Logo,
			HomeTeamLogo: game.HomeTeam.Logo,
		}
		filteredResponse.Games = append(filteredResponse.Games, filteredGame)
	}

	// Marshal the filtered data back to JSON
	filteredData, err := json.Marshal(filteredResponse)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Set the content type to application/json
	w.Header().Set("Content-Type", "application/json")

	// Write the filtered JSON data to the response
	w.Write(filteredData)
}

func handleProxy(url string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Request made for schedule")

		req, err := createRequest(r.Method, url, r.Header)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		copyResponse(w, resp)
	}
}

func main() {
	http.HandleFunc("/api/nhl-schedule", handleProxy("https://api-web.nhle.com/v1/club-schedule/EDM/week/now"))
	log.Println("Starting proxy server on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
