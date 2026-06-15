package repositories

import (
	"database/sql"
	"projeto_turismo_jp/db"
	"projeto_turismo_jp/models"
)


func (r *roteiroRepositoryImpl) GetRecommendations(touristID int64, limit int) ([]models.Roteiro, error) {
	result := []models.Roteiro{}
	seen := map[int64]bool{}

	categoryRows, err := db.DB.Query(`
		SELECT category, COUNT(*) as cnt FROM (
			SELECT r.category FROM roteiro_checkin c JOIN roteiro r ON r.id = c.roteiro_id WHERE c.tourist_id = ?
			UNION ALL
			SELECT r.category FROM roteiro_review rv JOIN roteiro r ON r.id = rv.roteiro_id WHERE rv.tourist_id = ? AND rv.rating >= 4
		) GROUP BY category ORDER BY cnt DESC
	`, touristID, touristID)
	if err != nil {
		return nil, err
	}

	var categories []string
	for categoryRows.Next() {
		var category string
		var cnt int
		if err := categoryRows.Scan(&category, &cnt); err != nil {
			categoryRows.Close()
			return nil, err
		}
		categories = append(categories, category)
	}
	categoryRows.Close()

	for _, category := range categories {
		if len(result) >= limit {
			break
		}

		rows, err := db.DB.Query(`
			SELECT * FROM roteiro
			WHERE category = ? AND id NOT IN (SELECT roteiro_id FROM roteiro_checkin WHERE tourist_id = ?)
			ORDER BY rating DESC
		`, category, touristID)
		if err != nil {
			return nil, err
		}

		roteiros, err := scanRoteiroRows(rows)
		rows.Close()
		if err != nil {
			return nil, err
		}

		appendUnseen(&result, roteiros, seen, limit)
	}

	if len(result) < limit {
		rows, err := db.DB.Query(`
			SELECT * FROM roteiro
			WHERE id NOT IN (SELECT roteiro_id FROM roteiro_checkin WHERE tourist_id = ?)
			ORDER BY rating DESC
		`, touristID)
		if err != nil {
			return nil, err
		}

		roteiros, err := scanRoteiroRows(rows)
		rows.Close()
		if err != nil {
			return nil, err
		}

		appendUnseen(&result, roteiros, seen, limit)
	}

	if len(result) < limit {
		rows, err := db.DB.Query("SELECT * FROM roteiro ORDER BY rating DESC")
		if err != nil {
			return nil, err
		}

		roteiros, err := scanRoteiroRows(rows)
		rows.Close()
		if err != nil {
			return nil, err
		}

		appendUnseen(&result, roteiros, seen, limit)
	}

	return result, nil
}

func appendUnseen(result *[]models.Roteiro, roteiros []models.Roteiro, seen map[int64]bool, limit int) {
	for _, roteiro := range roteiros {
		if len(*result) >= limit {
			return
		}
		if !seen[roteiro.ID] {
			seen[roteiro.ID] = true
			*result = append(*result, roteiro)
		}
	}
}

func scanRoteiroRows(rows *sql.Rows) ([]models.Roteiro, error) {
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
