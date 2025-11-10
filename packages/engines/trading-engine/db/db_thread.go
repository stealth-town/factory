package db

import (
	"context"
	"log"
)

func RunDBThread(ctx context.Context) {
	<-ctx.Done()
	log.Println("Closing DB thread")
}
