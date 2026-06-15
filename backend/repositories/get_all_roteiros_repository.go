package repositories

import (
	"projeto_turismo_jp/db"
	"projeto_turismo_jp/models"
)


func (r *roteiroRepositoryImpl) GetAllRoteiros(filter RoteiroFilter) ([]models.Roteiro, error) {
	query := "SELECT * FROM roteiro WHERE 1=1"
	var args []any

	if filter.Search != "" {
		query += " AND (name LIKE ? OR description LIKE ?)"
		searchTerm := "%" + filter.Search + "%"
		args = append(args, searchTerm, searchTerm)
	}

	if filter.Category != "" {
		query += " AND category = ?"
		args = append(args, filter.Category)
	}

	if filter.Location != "" {
		query += " AND location = ?"
		args = append(args, filter.Location)
	}

	rows, err := db.DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var roteiros []models.Roteiro

	for rows.Next() {
		var roteiro models.Roteiro
		err := rows.Scan(
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
		roteiros = append(roteiros, roteiro)
	}

	return roteiros, nil
}
