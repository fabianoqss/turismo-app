package controllers

import (
	"fmt"
	"log"
	"net/http"
	"projeto_turismo_jp/models"

	"github.com/gin-gonic/gin"
)

type CreateRoteiroRequest struct {
	Name        string  `json:"name" binding:"required"`
	Category    string  `json:"category" binding:"required"`
	Description string  `json:"description" binding:"required"`
	Location    string  `json:"location" binding:"required"`
	Rating      float64 `json:"rating"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
}

type CreateRoteiroResponse struct {
	Message string `json:"message" example:"roteiro saved"`
}

// CreateRoteiro godoc
// @Summary      Create a new roteiro
// @Description  Registered tourist adds a new roteiro to the catalog
// @Tags         Roteiro
// @Accept       json
// @Produce      json
// @Param        request body controllers.CreateRoteiroRequest true "Roteiro details"
// @Success      201 {object} controllers.CreateRoteiroResponse "Roteiro created successfully"
// @Failure      400 {object} map[string]string "Invalid request"
// @Failure      500 {object} map[string]string "Internal server error"
// @Security     Bearer
// @Router       /roteiro [post]
func (rc *RoteiroController) CreateRoteiro(context *gin.Context) {
	var roteiro models.Roteiro
	err := context.ShouldBindJSON(&roteiro)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "error"})
		log.Printf("error: %v", err)
		return
	}

	touristID := context.GetInt64("touristID")
	roteiro.CreatedBy = touristID

	err = rc.repo.SaveRoteiro(&roteiro)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "error"})
		log.Printf("error: %v", err)
		return
	}

	rc.hub.SendNotification(
		"roteiro_created",
		fmt.Sprintf("new roteiro added: %s", roteiro.Name),
		roteiro,
		)

	context.JSON(http.StatusCreated, gin.H{"message": "roteiro saved"})
}
