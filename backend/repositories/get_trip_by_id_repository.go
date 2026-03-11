package repositories

import (
	"projeto_turismo_jp/db"
	"projeto_turismo_jp/models"
)


func (r *tripRepositoryImpl) GetTripByID(id int64, touristID int64) (*models.Trip, error) {
	query := "SELECT * FROM trip WHERE id = ? AND tourist_id = ?"
	row := db.DB.QueryRow(query, id, touristID)

		var trip models.Trip
		err := row.Scan(
		&trip.ID, 
		&trip.LodgingLocation, 
		&trip.TripDescription, 
		&trip.ArrivalDate,
		&trip.DepartureDate,
		&trip.TripReview,
		&trip.Status,
		&trip.TouristID,
		&trip.CreatedAt,
		&trip.UpdatedAt,
		)
		if err != nil {
		return nil, err
	}
	return &trip, nil

}

