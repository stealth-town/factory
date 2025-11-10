package resolver

import (
	"context"
	"log"
	"time"

	"github.com/stealth-town/factory/config"
)

func RunResolver(ctx context.Context) {
	ticker := time.NewTicker(config.LoadedConfig.ResolverInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			log.Println("Closing resolver")
			return
		case <-ticker.C:
			// for i := range 4 {
			// 	go func(i int) {
			// 		log.Println("Resolver is running", i)
			// 	}(i)
			// }
		}
	}
}
