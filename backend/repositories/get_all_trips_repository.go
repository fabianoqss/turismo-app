package repositories

import (
	"projeto_turismo_jp/db"
	"projeto_turismo_jp/models"
)


func (r *tripRepositoryImpl) GetAllTrips() ([]models.Trip, error) {
	query := "SELECT * FROM trip"
	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	trips := []models.Trip{}

	for rows.Next() {
		var trip models.Trip
		err := rows.Scan(
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
		trips = append(trips, trip)
	}

	return trips, nil
}

