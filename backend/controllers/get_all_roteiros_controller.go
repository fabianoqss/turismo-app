package controllers

import (
	"log"
	"net/http"
	"projeto_turismo_jp/repositories"

	"github.com/gin-gonic/gin"
)


// GetAllRoteiros godoc
// @Summary      Get the roteiro catalog with optional search and filters
// @Tags         Roteiro
// @Produce      json
// @Param        search   query string false "Search by name or description"
// @Param        category query string false "Filter by category"
// @Param        location query string false "Filter by location"
// @Success      200 {array} models.Roteiro
// @Failure      500 {object} map[string]string "Internal server error"
// @Router       /roteiros [get]
func (rc *RoteiroController) GetAllRoteiros(context *gin.Context) {
	filter := repositories.RoteiroFilter{
		Search:   context.Query("search"),
		Category: context.Query("category"),
		Location: context.Query("location"),
	}

	roteiros, err := rc.repo.GetAllRoteiros(filter)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "could not fetch roteiros"})
		log.Printf("error: %v", err)
		return
	}

	context.JSON(http.StatusOK, roteiros)
}
