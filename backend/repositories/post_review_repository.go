package repositories

import (
	"projeto_turismo_jp/db"
	"projeto_turismo_jp/models"
)


func (r *reviewRepositoryImpl) SaveReview(review *models.Review) error {
	query := `
	INSERT INTO roteiro_review(roteiro_id, tourist_id, rating, comment)
	VALUES (?, ?, ?, ?)`

	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}

	defer stmt.Close()
	result, err := stmt.Exec(
		review.RoteiroID,
		review.TouristID,
		review.Rating,
		review.Comment,
	)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}
	review.ID = id

	updateQuery := `
	UPDATE roteiro
	SET rating = (SELECT AVG(rating) FROM roteiro_review WHERE roteiro_id = ?), updated_at = CURRENT_TIMESTAMP
	WHERE id = ?`

	_, err = db.DB.Exec(updateQuery, review.RoteiroID, review.RoteiroID)
	return err
}
