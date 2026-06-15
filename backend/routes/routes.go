package routes

import (
	"projeto_turismo_jp/controllers"
	"projeto_turismo_jp/middleware"

	"github.com/gin-gonic/gin"
)


type Dependencies struct {
	TouristController *controllers.TouristController
	TripController *controllers.TripController
	LogController *controllers.LogController
	RoteiroController *controllers.RoteiroController
	ReviewController *controllers.ReviewController
	CheckinController *controllers.CheckinController
	//add more when needed
}

func AppRoutes(server *gin.Engine, deps *Dependencies){
	//test route
	server.GET("/test", func(c *gin.Context) {
		c.String(200, "pong")
	})

	//public routes
	server.POST("/signup", deps.TouristController.Signup)
	server.POST("/login", deps.TouristController.Login)
	server.GET("/roteiros", deps.RoteiroController.GetAllRoteiros)
	server.GET("/get_roteiro_by_id/:id", deps.RoteiroController.GetRoteiroByID)
	server.GET("/roteiro/:id/reviews", deps.ReviewController.GetReviewsByRoteiroID)

	//protected routes(user)
	authenticated := server.Group("/")
	authenticated.Use(middleware.Authenticate())
	{
	authenticated.POST("/trip", deps.TripController.CreateTrip)
	authenticated.DELETE("/delete_trip/:id", deps.TripController.DeleteTrip)
	authenticated.GET("/get_trip_by_id/:id", deps.TripController.GetTripByID)
	authenticated.PUT("/add_trip_review/:id", deps.TripController.AddReview)
	authenticated.POST("/roteiro", deps.RoteiroController.CreateRoteiro)
	authenticated.POST("/roteiro/:id/review", deps.ReviewController.CreateReview)
	authenticated.POST("/roteiro/:id/checkin", deps.CheckinController.CreateCheckin)
	authenticated.GET("/tourist/badges", deps.CheckinController.GetBadges)
	authenticated.GET("/tourist/recommendations", deps.RoteiroController.GetRecommendations)
	}

	//protected routes(admin)
	admin := server.Group("/admin")
	admin.Use(middleware.Authenticate())
	admin.Use(middleware.RequireAdmin())
	{
	admin.GET("/get_all_trips", deps.TripController.GetAllTrips)
	admin.GET("/get_all_logs", deps.LogController.GetAllLogs)
	}
}

