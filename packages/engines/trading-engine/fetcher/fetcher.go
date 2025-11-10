package fetcher

import (
	"context"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/stealth-town/factory/config"
)

func RunFetcher(ctx context.Context) {
	ticker := time.NewTicker(config.LoadedConfig.FetcherInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			log.Println("Closing fetcher")
			return
		case <-ticker.C:
			now := time.Now()
			data, err := fetch(config.LoadedConfig.Url)
			log.Println("Time taken", time.Since(now))
			if err != nil {
				log.Println("Error fetching data", err)
				continue
			}
			log.Println("Fetched data", data)
		}
	}
}

func fetch(url string) (string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	return string(body), nil
}
