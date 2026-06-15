package repositories

import (
	"database/sql"
	"projeto_turismo_jp/models"
)


type TouristRepository interface {
	Save(tourist *models.Tourist) error
	ValidateCredentials(tourist *models.Tourist) error
}

type touristRepositoryImpl struct {
	db *sql.DB
}

func NewTouristRepository(db *sql.DB) TouristRepository {
	return &touristRepositoryImpl{
		db: db,
	}
}

type TripRepository interface {
	GetTripByID(id int64, touristID int64) (*models.Trip, error)
	GetAllTrips() ([]models.Trip, error)
	SaveTrip(trip *models.Trip) error
	DeleteTrip(id int64) error
	AddReview(trip *models.Trip) error 
}

type tripRepositoryImpl struct {
	db *sql.DB
}

func NewTripRepository(db *sql.DB) TripRepository {
	return &tripRepositoryImpl{
		db: db,
	}
}

type LogRepository interface {
	GetAllLogs() ([]models.Notification, error)

}

type logRepositoryImpl struct {
	db *sql.DB
}

func NewlogRepository(db *sql.DB) LogRepository {
	return &logRepositoryImpl{
		db: db,
	}
}

type RoteiroFilter struct {
	Search   string
	Category string
	Location string
}

type RoteiroRepository interface {
	SaveRoteiro(roteiro *models.Roteiro) error
	GetAllRoteiros(filter RoteiroFilter) ([]models.Roteiro, error)
	GetRoteiroByID(id int64) (*models.Roteiro, error)
	GetRecommendations(touristID int64, limit int) ([]models.Roteiro, error)
}

type roteiroRepositoryImpl struct {
	db *sql.DB
}

func NewRoteiroRepository(db *sql.DB) RoteiroRepository {
	return &roteiroRepositoryImpl{
		db: db,
	}
}

type ReviewRepository interface {
	SaveReview(review *models.Review) error
	GetReviewsByRoteiroID(roteiroID int64) ([]models.Review, error)
}

type reviewRepositoryImpl struct {
	db *sql.DB
}

func NewReviewRepository(db *sql.DB) ReviewRepository {
	return &reviewRepositoryImpl{
		db: db,
	}
}

type CheckinStats struct {
	TotalRoteiros int
	Categories    map[string]int
}

type CheckinRepository interface {
	SaveCheckin(checkin *models.Checkin) error
	GetCheckinStats(touristID int64) (CheckinStats, error)
}

type checkinRepositoryImpl struct {
	db *sql.DB
}

func NewCheckinRepository(db *sql.DB) CheckinRepository {
	return &checkinRepositoryImpl{
		db: db,
	}
}

