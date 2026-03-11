package controllers

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)


func (tc *TripController) AddReview(context *gin.Context) {
	tripID, err := strconv.ParseInt(context.Param("id"), 10, 64)
	if err != nil {
		log.Printf("error: %v", err)
		context.JSON(http.StatusBadRequest, gin.H{"message": "could not parse the trip"})
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

	var reviewData struct {
		TripReview string `json:"trip_review" binding:"required"`
	}
	if err = context.ShouldBindJSON(&reviewData)
	err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "invalid review data"})
		log.Printf("error: %v", err)
	}

	trip.TripReview = reviewData.TripReview

	err = tc.repo.AddReview(trip)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "could not register the review"})
		log.Printf("error: %v", err)
		return
	}

	tc.hub.SendNotification(
	"new_review_added",
	fmt.Sprintf("tourist of ID: %d added a new review for trip of ID: %d", touristID, trip.ID),
	trip,
	)


	context.JSON(http.StatusOK, gin.H{"message": "review registered"})
} 

