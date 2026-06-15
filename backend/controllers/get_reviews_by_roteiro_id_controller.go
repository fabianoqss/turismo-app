package controllers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)


// GetReviewsByRoteiroID godoc
// @Summary      Get reviews for a roteiro
// @Tags         Review
// @Produce      json
// @Param        id path int true "Roteiro ID"
// @Success      200 {array} models.Review
// @Failure      400 {object} map[string]string "Invalid request"
// @Failure      500 {object} map[string]string "Internal server error"
// @Router       /roteiro/{id}/reviews [get]
func (rc *ReviewController) GetReviewsByRoteiroID(context *gin.Context) {
	roteiroID, err := strconv.ParseInt(context.Param("id"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "invalid roteiro id"})
		return
	}

	reviews, err := rc.repo.GetReviewsByRoteiroID(roteiroID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "could not fetch reviews"})
		log.Printf("error: %v", err)
		return
	}

	context.JSON(http.StatusOK, reviews)
}
