package repositories

import (
	"projeto_turismo_jp/db"
	"projeto_turismo_jp/models"
)


func (r *reviewRepositoryImpl) GetReviewsByRoteiroID(roteiroID int64) ([]models.Review, error) {
	query := "SELECT * FROM roteiro_review WHERE roteiro_id = ? ORDER BY created_at DESC"

	rows, err := db.DB.Query(query, roteiroID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	reviews := []models.Review{}

	for rows.Next() {
		var review models.Review
		err := rows.Scan(
			&review.ID,
			&review.RoteiroID,
			&review.TouristID,
			&review.Rating,
			&review.Comment,
			&review.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		reviews = append(reviews, review)
	}

	return reviews, nil
}
