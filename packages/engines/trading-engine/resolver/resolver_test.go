package resolver

import (
	"context"
	"testing"
	"time"
)

func TestResolver(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go RunResolver(ctx)

	time.Sleep(10 * time.Second)
}
