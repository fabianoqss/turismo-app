package controllers

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)


func (tc *TripController) DeleteTrip(context *gin.Context) {
	tripID, err := strconv.ParseInt(context.Param("id"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "could not parse the trip"})
		log.Printf("error: %v", err)
		return
	}

	touristID := context.GetInt64("touristID")
	trip, err := tc.repo.GetTripByID(tripID, touristID)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "could not fetch the trip"})
		return
	}

	if trip.TouristID != int(touristID) {
		context.JSON(http.StatusUnauthorized, gin.H{"message": "not authorized to delete trip"})
		log.Printf("error: %v", err)
		return
	}

	err = tc.repo.DeleteTrip(tripID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "could not delete the trip"})
		log.Printf("error: %v", err)
		return
	}
	
	tc.hub.SendNotification(
		"trip_deleted",
		fmt.Sprintf("trip to %s deleted", trip.LodgingLocation),
		trip,
		)

	context.JSON(http.StatusOK, gin.H{"message": "trip deleted"})
}

