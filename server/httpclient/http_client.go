package httpclient

import "net/http"

type HttpClient interface {
	Do(req *http.Request) (*http.Response, error)
}

type DefaultHttpClient struct{}

func (c *DefaultHttpClient) Do(req *http.Request) (*http.Response, error) {
	return http.DefaultClient.Do(req)
}
