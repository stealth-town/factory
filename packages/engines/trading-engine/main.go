package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/stealth-town/factory/config"
	"github.com/stealth-town/factory/db"
	"github.com/stealth-town/factory/fetcher"
	"github.com/stealth-town/factory/redis"
	"github.com/stealth-town/factory/resolver"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())

	config.LoadConfig()
	redis.InitRedis()

	go fetcher.RunFetcher(ctx)
	go db.RunDBThread(ctx)
	go resolver.RunResolver(ctx)

	log.Println("Trading engine started")
	log.Println("Press Ctrl+C to stop")

	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
	<-sig

	cancel()
	time.Sleep(time.Second)

	log.Println("Trading engine stopped")
}
