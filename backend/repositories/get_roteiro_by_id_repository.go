package repositories

import (
	"projeto_turismo_jp/db"
	"projeto_turismo_jp/models"
)


func (r *roteiroRepositoryImpl) GetRoteiroByID(id int64) (*models.Roteiro, error) {
	query := "SELECT * FROM roteiro WHERE id = ?"
	row := db.DB.QueryRow(query, id)

	var roteiro models.Roteiro
	err := row.Scan(
		&roteiro.ID,
		&roteiro.Name,
		&roteiro.Category,
		&roteiro.Description,
		&roteiro.Location,
		&roteiro.Rating,
		&roteiro.CreatedBy,
		&roteiro.CreatedAt,
		&roteiro.UpdatedAt,
		&roteiro.Latitude,
		&roteiro.Longitude,
		)
	if err != nil {
		return nil, err
	}
	return &roteiro, nil
}
