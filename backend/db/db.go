package db

import (
	"database/sql"
	"log"
	"projeto_turismo_jp/utils"

	_ "github.com/mattn/go-sqlite3"
)


var DB *sql.DB

func InitDB() {
	var err error 
	DB, err = sql.Open("sqlite3", "api.db")
	if err != nil {
		panic("could not connect to database")
	}

	DB.SetMaxOpenConns(10)
	DB.SetConnMaxIdleTime(5)

	createTables()
	createAdminUser()
	seedRoteiros()
}

func createTables() {
	createTouristTable := `
	CREATE TABLE IF NOT EXISTS tourist (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL,
		role TEXT DEFAULT 'user'
	)
	`
	_, err := DB.Exec(createTouristTable)
	if err != nil {
		panic("could not create tourist table")
	}

	createTripTable := `
	CREATE TABLE IF NOT EXISTS trip (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	lodging_location TEXT NOT NULL,
	trip_description TEXT NOT NULL,
	arrival_date DATE NOT NULL,
	departure_date DATE NOT NULL,
	trip_review TEXT DEFAULT '',
	status TEXT DEFAULT 'upcoming' CHECK(status IN ('upcoming', 'ongoing', 'completed')),
	tourist_id INTEGER NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(tourist_id) REFERENCES tourist(id)
	)
	`
	_, err = DB.Exec(createTripTable)
	if err != nil {
		panic("could not create trip table")
	}

	createLogTable := `
	CREATE TABLE IF NOT EXISTS notification_logs (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	type TEXT NOT NULL,
	message TEXT NOT NULL,
	data TEXT,
	timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	)
	`
	_, err = DB.Exec(createLogTable)
	if err != nil {
		panic("could not create log table")
	}

	createRoteiroTable := `
	CREATE TABLE IF NOT EXISTS roteiro (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	category TEXT NOT NULL,
	description TEXT NOT NULL,
	location TEXT NOT NULL,
	rating REAL DEFAULT 0,
	created_by INTEGER NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	latitude REAL NOT NULL DEFAULT 0,
	longitude REAL NOT NULL DEFAULT 0,
	FOREIGN KEY(created_by) REFERENCES tourist(id)
	)
	`
	_, err = DB.Exec(createRoteiroTable)
	if err != nil {
		panic("could not create roteiro table")
	}

	createRoteiroReviewTable := `
	CREATE TABLE IF NOT EXISTS roteiro_review (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	roteiro_id INTEGER NOT NULL,
	tourist_id INTEGER NOT NULL,
	rating REAL NOT NULL,
	comment TEXT NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(roteiro_id) REFERENCES roteiro(id),
	FOREIGN KEY(tourist_id) REFERENCES tourist(id)
	)
	`
	_, err = DB.Exec(createRoteiroReviewTable)
	if err != nil {
		panic("could not create roteiro_review table")
	}

	createRoteiroCheckinTable := `
	CREATE TABLE IF NOT EXISTS roteiro_checkin (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	roteiro_id INTEGER NOT NULL,
	tourist_id INTEGER NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(roteiro_id) REFERENCES roteiro(id),
	FOREIGN KEY(tourist_id) REFERENCES tourist(id)
	)
	`
	_, err = DB.Exec(createRoteiroCheckinTable)
	if err != nil {
		panic("could not create roteiro_checkin table")
	}
}

func createAdminUser() {
    var count int
    err := DB.QueryRow("SELECT COUNT(*) FROM tourist WHERE role = 'admin'").Scan(&count)
    if err != nil || count > 0 {
        return
    }

    hashedPassword, _ := utils.HashPassword("admin123")

    query := `INSERT INTO tourist (email, password, role) VALUES (?, ?, ?)`
    _, err = DB.Exec(query, "admin@proton.me", hashedPassword, "admin")
    if err != nil {
        log.Printf("Failed to create admin: %v", err)
    } else {
        log.Println("Admin user created: admin@example.com")
    }
}

func seedRoteiros() {
    var count int
    err := DB.QueryRow("SELECT COUNT(*) FROM roteiro").Scan(&count)
    if err != nil || count > 0 {
        return
    }

    var adminID int64
    err = DB.QueryRow("SELECT id FROM tourist WHERE role = 'admin' LIMIT 1").Scan(&adminID)
    if err != nil {
        log.Printf("Failed to find admin for roteiro seed: %v", err)
        return
    }

    roteiros := []struct {
        name        string
        category    string
        description string
        location    string
        rating      float64
        latitude    float64
        longitude   float64
    }{
        {
            "Praia de Tambau",
            "praia",
            "Uma das praias mais famosas de João Pessoa, com águas calmas, quiosques, e a famosa estátua do Cristo. Ótima para famílias e caminhadas ao pôr do sol.",
            "João Pessoa",
            4.8,
            -7.115,
            -34.861,
        },
        {
            "Centro Histórico",
            "cultura",
            "O centro histórico de João Pessoa é um dos mais preservados do Brasil, com igrejas barrocas, casarões coloniais e museus que contam séculos de história paraibana.",
            "João Pessoa",
            4.6,
            -7.119,
            -34.869,
        },
        {
            "Feira de Artesanato",
            "gastronomia",
            "Feira tradicional com artesãos locais vendendo peças únicas de cerâmica, bordado e couro. Também tem barracas com comidas típicas paraibanas.",
            "João Pessoa",
            4.7,
            -7.122,
            -34.856,
        },
        {
            "Parque Sólon de Lucena",
            "natureza",
            "Conhecido como Lagoa, é o cartão postal de João Pessoa. Um lago cercado de palmeiras imperiais no coração da cidade, ideal para caminhadas e piqueniques.",
            "João Pessoa",
            4.5,
            -7.110,
            -34.863,
        },
    }

    query := `INSERT INTO roteiro (name, category, description, location, rating, created_by, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    for _, r := range roteiros {
        _, err := DB.Exec(query, r.name, r.category, r.description, r.location, r.rating, adminID, r.latitude, r.longitude)
        if err != nil {
            log.Printf("Failed to seed roteiro %s: %v", r.name, err)
        }
    }
}
