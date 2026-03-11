package controllers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)


func (tc *TripController) GetTripByID(context *gin.Context) {
	tripID, err := strconv.ParseInt(context.Param("id"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "could not parse the trip"})
		log.Printf("error: %v", err)
		return
	} 

	touristID := context.GetInt64("touristID")

	trip, err := tc.repo.GetTripByID(tripID, touristID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "could not fetch the trip info"})
		log.Printf("error: %v", err)
		return
	}

	if int64(trip.TouristID) != touristID {
		context.JSON(http.StatusForbidden, gin.H{"message": "forbidden"})
		return
	}

	context.JSON(http.StatusOK, trip)
}

