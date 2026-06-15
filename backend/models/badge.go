package models

type Badge struct {
	Code        string `json:"code"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
	Earned      bool   `json:"earned"`
}

type MilestoneBadgeDef struct {
	Threshold   int
	Code        string
	Name        string
	Description string
	Icon        string
}

var MilestoneBadges = []MilestoneBadgeDef{
	{1, "first_checkin", "Primeira Aventura", "Faça check-in em um roteiro", "🥇"},
	{3, "explorador", "Explorador", "Faça check-in em 3 roteiros diferentes", "🧭"},
	{5, "lenda_local", "Lenda Local", "Faça check-in em 5 roteiros diferentes", "👑"},
}

type CategoryBadgeDef struct {
	Code        string
	Name        string
	Description string
	Icon        string
}

var CategoryOrder = []string{"praia", "cultura", "gastronomia", "natureza", "aventura"}

var CategoryBadges = map[string]CategoryBadgeDef{
	"praia":       {"praia_lover", "Amante da Praia", "Check-in em um roteiro de praia", "🏖️"},
	"cultura":     {"culture_buff", "Apreciador de Cultura", "Check-in em um roteiro de cultura", "🏛️"},
	"gastronomia": {"foodie", "Gourmet", "Check-in em um roteiro de gastronomia", "🍽️"},
	"natureza":    {"nature_lover", "Amante da Natureza", "Check-in em um roteiro de natureza", "🌳"},
	"aventura":    {"aventureiro", "Aventureiro", "Check-in em um roteiro de aventura", "🪂"},
}
