package controllers

import (
	"fmt"
	"log"
	"net/http"
	"projeto_turismo_jp/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CreateCheckinResponse struct {
	Message string `json:"message" example:"checkin saved"`
}

// CreateCheckin godoc
// @Summary      Check in at a roteiro
// @Description  Registered tourist checks in at a roteiro, counting towards their badges
// @Tags         Checkin
// @Produce      json
// @Param        id path int true "Roteiro ID"
// @Success      201 {object} controllers.CreateCheckinResponse "Check-in saved successfully"
// @Failure      400 {object} map[string]string "Invalid request"
// @Failure      500 {object} map[string]string "Internal server error"
// @Security     Bearer
// @Router       /roteiro/{id}/checkin [post]
func (cc *CheckinController) CreateCheckin(context *gin.Context) {
	roteiroID, err := strconv.ParseInt(context.Param("id"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "invalid roteiro id"})
		return
	}

	checkin := models.Checkin{
		RoteiroID: roteiroID,
		TouristID: context.GetInt64("touristID"),
	}

	if err := cc.repo.SaveCheckin(&checkin); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "error"})
		log.Printf("error: %v", err)
		return
	}

	cc.hub.SendNotification(
		"roteiro_checkin",
		fmt.Sprintf("tourist %d checked in at roteiro %d", checkin.TouristID, checkin.RoteiroID),
		checkin,
	)

	context.JSON(http.StatusCreated, gin.H{"message": "checkin saved"})
}
