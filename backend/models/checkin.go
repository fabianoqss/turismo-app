package models

import (
	"time"
)

type Checkin struct {
	ID        int64     `json:"id"`
	RoteiroID int64     `json:"roteiro_id"`
	TouristID int64     `json:"tourist_id"`
	CreatedAt time.Time `json:"created_at"`
}
