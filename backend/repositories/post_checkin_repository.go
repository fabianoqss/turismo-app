package repositories

import (
	"projeto_turismo_jp/db"
	"projeto_turismo_jp/models"
)


func (r *checkinRepositoryImpl) SaveCheckin(checkin *models.Checkin) error {
	query := `INSERT INTO roteiro_checkin(roteiro_id, tourist_id) VALUES (?, ?)`

	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}

	defer stmt.Close()
	result, err := stmt.Exec(checkin.RoteiroID, checkin.TouristID)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	checkin.ID = id
	return err
}
