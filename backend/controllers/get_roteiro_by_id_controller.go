package controllers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)


// GetRoteiroByID godoc
// @Summary      Get a roteiro by id
// @Tags         Roteiro
// @Produce      json
// @Param        id path int true "Roteiro ID"
// @Success      200 {object} models.Roteiro
// @Failure      400 {object} map[string]string "Invalid request"
// @Failure      404 {object} map[string]string "Roteiro not found"
// @Router       /get_roteiro_by_id/{id} [get]
func (rc *RoteiroController) GetRoteiroByID(context *gin.Context) {
	roteiroID, err := strconv.ParseInt(context.Param("id"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "could not parse the roteiro id"})
		log.Printf("error: %v", err)
		return
	}

	roteiro, err := rc.repo.GetRoteiroByID(roteiroID)
	if err != nil {
		context.JSON(http.StatusNotFound, gin.H{"message": "roteiro not found"})
		log.Printf("error: %v", err)
		return
	}

	context.JSON(http.StatusOK, roteiro)
}
