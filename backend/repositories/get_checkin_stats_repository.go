package repositories

import (
	"projeto_turismo_jp/db"
)


func (r *checkinRepositoryImpl) GetCheckinStats(touristID int64) (CheckinStats, error) {
	stats := CheckinStats{Categories: map[string]int{}}

	err := db.DB.QueryRow(
		"SELECT COUNT(DISTINCT roteiro_id) FROM roteiro_checkin WHERE tourist_id = ?",
		touristID,
	).Scan(&stats.TotalRoteiros)
	if err != nil {
		return stats, err
	}

	rows, err := db.DB.Query(`
		SELECT r.category, COUNT(DISTINCT rc.roteiro_id)
		FROM roteiro_checkin rc
		JOIN roteiro r ON r.id = rc.roteiro_id
		WHERE rc.tourist_id = ?
		GROUP BY r.category
	`, touristID)
	if err != nil {
		return stats, err
	}
	defer rows.Close()

	for rows.Next() {
		var category string
		var count int
		if err := rows.Scan(&category, &count); err != nil {
			return stats, err
		}
		stats.Categories[category] = count
	}

	return stats, nil
}
