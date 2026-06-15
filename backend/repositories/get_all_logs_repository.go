package repositories

import (
	"projeto_turismo_jp/db"
	"projeto_turismo_jp/models"
)


func (r *logRepositoryImpl) GetAllLogs() ([]models.Notification, error) {
	query := "SELECT * FROM notification_logs"
	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	logs := []models.Notification{}

	for rows.Next() {
		var log models.Notification
		err := rows.Scan(
		&log.ID,
		&log.Type,
		&log.Message,
		&log.Data,
		&log.Timestamp,
	)
	if err != nil {
			return nil, err
		}
		logs = append(logs, log)
	}
	
	return logs, nil
}

