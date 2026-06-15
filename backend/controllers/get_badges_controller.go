package controllers

import (
	"log"
	"net/http"
	"projeto_turismo_jp/models"

	"github.com/gin-gonic/gin"
)


// GetBadges godoc
// @Summary      Get the authenticated tourist's badges
// @Description  Returns all available badges and whether the tourist has earned each one based on their check-ins
// @Tags         Checkin
// @Produce      json
// @Success      200 {array} models.Badge
// @Failure      500 {object} map[string]string "Internal server error"
// @Security     Bearer
// @Router       /tourist/badges [get]
func (cc *CheckinController) GetBadges(context *gin.Context) {
	touristID := context.GetInt64("touristID")

	stats, err := cc.repo.GetCheckinStats(touristID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "could not fetch badges"})
		log.Printf("error: %v", err)
		return
	}

	badges := []models.Badge{}

	for _, b := range models.MilestoneBadges {
		badges = append(badges, models.Badge{
			Code:        b.Code,
			Name:        b.Name,
			Description: b.Description,
			Icon:        b.Icon,
			Earned:      stats.TotalRoteiros >= b.Threshold,
		})
	}

	for _, category := range models.CategoryOrder {
		b := models.CategoryBadges[category]
		badges = append(badges, models.Badge{
			Code:        b.Code,
			Name:        b.Name,
			Description: b.Description,
			Icon:        b.Icon,
			Earned:      stats.Categories[category] > 0,
		})
	}

	context.JSON(http.StatusOK, badges)
}
