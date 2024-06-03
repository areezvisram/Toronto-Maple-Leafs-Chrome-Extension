package handler

import (
	"log"
	"net/http"
	"tml-extension-server/httpclient"
	"tml-extension-server/processors"
	"tml-extension-server/utils"
)

func HandleNextGameProxy(url string, client httpclient.HttpClient) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Request made for NHL schedule")

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

		if err := utils.CopyResponse(w, resp, processors.NHLGameProcessor); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}
}
