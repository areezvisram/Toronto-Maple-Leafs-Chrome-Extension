package utils

import (
	"compress/gzip"
	"io"
	"net/http"
	"strings"
)

type ResponseProcessor func([]byte) ([]byte, error)

func CreateRequest(method, url string, header http.Header) (*http.Request, error) {
	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		return nil, err
	}

	for k, v := range header {
		req.Header[k] = v
	}

	return req, nil
}

func CopyResponse(w http.ResponseWriter, resp *http.Response, processor ResponseProcessor) error {
	defer resp.Body.Close()

	var reader io.Reader

	if strings.Contains(resp.Header.Get("Content-Encoding"), "gzip") {
		gzipReader, err := gzip.NewReader(resp.Body)
		if err != nil {
			return err
		}
		defer gzipReader.Close()
		reader = gzipReader
	} else {
		reader = resp.Body
	}

	body, err := io.ReadAll(reader)
	if err != nil {
		return err
	}

	processedBody, err := processor(body)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(processedBody)
	return nil
}

func ReadAndProcessResponse(resp *http.Response, processor ResponseProcessor) ([]byte, error) {
	defer resp.Body.Close()

	var reader io.Reader
	if strings.Contains(resp.Header.Get("Content-Encoding"), "gzip") {
		gzipReader, err := gzip.NewReader(resp.Body)
		if err != nil {
			return nil, err
		}
		defer gzipReader.Close()
		reader = gzipReader
	} else {
		reader = resp.Body
	}

	body, err := io.ReadAll(reader)
	if err != nil {
		return nil, err
	}

	return processor(body)
}

func EnableCors(w *http.ResponseWriter)  {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}