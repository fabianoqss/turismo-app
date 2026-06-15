package models

import (
	"time"
)

type Review struct {
	ID        int64     `json:"id"`
	RoteiroID int64     `json:"roteiro_id"`
	TouristID int64     `json:"tourist_id"`
	Rating    float64   `json:"rating" binding:"required,min=1,max=5"`
	Comment   string    `json:"comment" binding:"required"`
	CreatedAt time.Time `json:"created_at"`
}
