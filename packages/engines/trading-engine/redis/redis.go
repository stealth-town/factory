package redis

import (
	"context"
	"encoding/json"

	goRedis "github.com/redis/go-redis/v9"
	"github.com/stealth-town/factory/config"
	"github.com/stealth-town/factory/types"
)

var redisClient *goRedis.Client

func InitRedis() {
	redisClient = goRedis.NewClient(&goRedis.Options{
		Addr: config.LoadedConfig.RedisUrl,
	})
}

func GetRedisClient() *goRedis.Client {
	return redisClient
}

func GetAllTrades() ([]types.Trade, error) {
	sliceCmd := redisClient.Keys(context.Background(), "trades:*")
	if sliceCmd.Err() != nil {
		return nil, sliceCmd.Err()
	}

	trades := []types.Trade{}
	for _, key := range sliceCmd.Val() {
		cmd := redisClient.Get(context.Background(), key)
		if cmd.Err() != nil {
			return nil, cmd.Err()
		}

		trade := types.Trade{}

		if err := json.Unmarshal([]byte(cmd.Val()), &trade); err != nil {
			return nil, err
		}

		trades = append(trades, trade)
	}

	return trades, nil
}
