package controllers

import (
	"fmt"
	"log"
	"net/http"
	"projeto_turismo_jp/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CreateReviewRequest struct {
	Rating  float64 `json:"rating" binding:"required,min=1,max=5"`
	Comment string  `json:"comment" binding:"required"`
}

type CreateReviewResponse struct {
	Message string `json:"message" example:"review saved"`
}

// CreateReview godoc
// @Summary      Add a review to a roteiro
// @Description  Registered tourist leaves a rating and comment for a roteiro
// @Tags         Review
// @Accept       json
// @Produce      json
// @Param        id      path int                              true "Roteiro ID"
// @Param        request body controllers.CreateReviewRequest true "Review details"
// @Success      201 {object} controllers.CreateReviewResponse "Review created successfully"
// @Failure      400 {object} map[string]string "Invalid request"
// @Failure      500 {object} map[string]string "Internal server error"
// @Security     Bearer
// @Router       /roteiro/{id}/review [post]
func (rc *ReviewController) CreateReview(context *gin.Context) {
	roteiroID, err := strconv.ParseInt(context.Param("id"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "invalid roteiro id"})
		return
	}

	var request CreateReviewRequest
	if err := context.ShouldBindJSON(&request); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "error"})
		log.Printf("error: %v", err)
		return
	}

	review := models.Review{
		RoteiroID: roteiroID,
		TouristID: context.GetInt64("touristID"),
		Rating:    request.Rating,
		Comment:   request.Comment,
	}

	if err := rc.repo.SaveReview(&review); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "error"})
		log.Printf("error: %v", err)
		return
	}

	rc.hub.SendNotification(
		"roteiro_review_added",
		fmt.Sprintf("new review added for roteiro %d", review.RoteiroID),
		review,
	)

	context.JSON(http.StatusCreated, gin.H{"message": "review saved"})
}
