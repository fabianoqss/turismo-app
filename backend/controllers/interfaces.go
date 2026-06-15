package controllers

import (
	"projeto_turismo_jp/repositories"
	"projeto_turismo_jp/websocket"
)


type TouristController struct {
	repo repositories.TouristRepository
	hub *websocket.Hub
}

func NewTouristController(repo repositories.TouristRepository, hub *websocket.Hub) *TouristController {
	return &TouristController{
		repo: repo,
		hub: hub,
	}
}

type TripController struct {
	repo repositories.TripRepository
	hub *websocket.Hub
}

func NewTripController(repo repositories.TripRepository, hub *websocket.Hub) *TripController {
	return &TripController{
		repo: repo,
		hub: hub,
	}
}

type LogController struct {
	repo repositories.LogRepository
}

func NewLogController(repo repositories.LogRepository) *LogController {
	return &LogController{
		repo: repo,
	}
}

type RoteiroController struct {
	repo repositories.RoteiroRepository
	hub *websocket.Hub
}

func NewRoteiroController(repo repositories.RoteiroRepository, hub *websocket.Hub) *RoteiroController {
	return &RoteiroController{
		repo: repo,
		hub: hub,
	}
}

type ReviewController struct {
	repo repositories.ReviewRepository
	hub *websocket.Hub
}

func NewReviewController(repo repositories.ReviewRepository, hub *websocket.Hub) *ReviewController {
	return &ReviewController{
		repo: repo,
		hub: hub,
	}
}

type CheckinController struct {
	repo repositories.CheckinRepository
	hub *websocket.Hub
}

func NewCheckinController(repo repositories.CheckinRepository, hub *websocket.Hub) *CheckinController {
	return &CheckinController{
		repo: repo,
		hub: hub,
	}
}

