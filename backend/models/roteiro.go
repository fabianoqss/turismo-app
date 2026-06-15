package models

import (
	"time"
)

type Roteiro struct {
	ID          int64     `json:"id"`
	Name        string    `json:"name" binding:"required"`
	Category    string    `json:"category" binding:"required"`
	Description string    `json:"description" binding:"required"`
	Location    string    `json:"location" binding:"required"`
	Rating      float64   `json:"rating"`
	CreatedBy   int64     `json:"created_by"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	Latitude    float64   `json:"latitude"`
	Longitude   float64   `json:"longitude"`
}
