package main

import (
	"log"
	"projeto_turismo_jp/controllers"
	"projeto_turismo_jp/db"
	"projeto_turismo_jp/repositories"
	"projeto_turismo_jp/routes"
	"projeto_turismo_jp/server"
	"projeto_turismo_jp/websocket"
	"github.com/gin-contrib/cors"

	_ "projeto_turismo_jp/docs"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title           Tourism Platform API
// @version         1.0
// @description     A REST API for managing tourism platform operations
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    http://www.yourwebsite.com/support
// @contact.email  support@yourwebsite.com

// @license.name  MIT
// @license.url   https://opensource.org/licenses/MIT

// @host      localhost:8080
// @BasePath  /

// @schemes http https

// @securityDefinitions.apikey Bearer
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.
func main() {
	db.InitDB()

	hub := websocket.NewHub()
	go hub.Run()

	server := server.SetupServer()

	server.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"http://localhost:3000"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowHeaders:     []string{"Authorization", "Content-Type"},
    AllowCredentials: true,
}))

	//Data layer
	touristRepo := repositories.NewTouristRepository(db.DB)
	tripRepo := repositories.NewTripRepository(db.DB)
	logRepo := repositories.NewlogRepository(db.DB)

	//http layer
	touristController := controllers.NewTouristController(touristRepo, hub)
	tripController := controllers.NewTripController(tripRepo, hub)
	logController := controllers.NewLogController(logRepo)

	deps := &routes.Dependencies{
		TouristController: touristController,
		TripController: tripController,
		LogController: logController,
	}

	server.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	server.GET("/ws", func(c *gin.Context){
		websocket.ServeWs(hub, c.Writer, c.Request)
	})

	routes.AppRoutes(server, deps)

	log.Println("Server starting on :8080")
	log.Println("Swagger documentation available at: http://localhost:8080/swagger/index.html")
	server.Run(":8080")
}

