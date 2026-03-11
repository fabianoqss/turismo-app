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

