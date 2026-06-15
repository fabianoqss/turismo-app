package repositories

import (
	"projeto_turismo_jp/db"
	"projeto_turismo_jp/models"
)


func (r *roteiroRepositoryImpl) SaveRoteiro(roteiro *models.Roteiro) error {
	query := `
	INSERT INTO roteiro(name, category, description, location, rating, created_by, latitude, longitude)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}

	defer stmt.Close()
	result, err := stmt.Exec(
		roteiro.Name,
		roteiro.Category,
		roteiro.Description,
		roteiro.Location,
		roteiro.Rating,
		roteiro.CreatedBy,
		roteiro.Latitude,
		roteiro.Longitude,
		)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	roteiro.ID = id
	return err
}
