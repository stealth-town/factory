package types

import "time"

type Trade struct {
	ID        string    `json:"id"`
	Value     float64   `json:"value"`
	Timestamp time.Time `json:"timestamp"`
	Status    string    `json:"status"`
}
