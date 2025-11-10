package config

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	FetcherInterval  time.Duration
	ResolverInterval time.Duration
	DbInterval       time.Duration
	Url              string
	DbUrl            string
	RedisUrl         string
}

var LoadedConfig *Config

const defaultDuration = 500 * time.Millisecond

func getDurationValue(name string) time.Duration {
	value := os.Getenv(name)
	if value == "" {
		return defaultDuration
	}
	duration, err := time.ParseDuration(value)
	if err != nil {
		return defaultDuration
	}

	return duration
}

func LoadConfig() *Config {

	if err := godotenv.Load(); err != nil {
		log.Println("Could not load .env file, using default config")

		LoadedConfig = &Config{
			FetcherInterval:  defaultDuration,
			ResolverInterval: defaultDuration,
			DbInterval:       defaultDuration,
			Url:              "https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDC",
			DbUrl:            "postgres://postgres:postgres@postgres:5432/postgres",
			RedisUrl:         "redis://redis:6379",
		}

		return LoadedConfig
	}

	LoadedConfig = &Config{
		FetcherInterval:  getDurationValue("FETCHER_INTERVAL"),
		ResolverInterval: getDurationValue("RESOLVER_INTERVAL"),
		DbInterval:       getDurationValue("DB_INTERVAL"),
		Url:              os.Getenv("URL"),
		DbUrl:            os.Getenv("DB_URL"),
		RedisUrl:         os.Getenv("REDIS_URL"),
	}

	return LoadedConfig
}
