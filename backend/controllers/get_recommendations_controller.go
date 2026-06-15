package controllers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)


// GetRecommendations godoc
// @Summary      Get personalized roteiro recommendations
// @Description  Returns roteiros recommended for the authenticated tourist based on their check-ins and reviews
// @Tags         Roteiro
// @Produce      json
// @Success      200 {array} models.Roteiro
// @Failure      500 {object} map[string]string "Internal server error"
// @Security     Bearer
// @Router       /tourist/recommendations [get]
func (rc *RoteiroController) GetRecommendations(context *gin.Context) {
	touristID := context.GetInt64("touristID")

	roteiros, err := rc.repo.GetRecommendations(touristID, 5)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "could not fetch recommendations"})
		log.Printf("error: %v", err)
		return
	}

	context.JSON(http.StatusOK, roteiros)
}
