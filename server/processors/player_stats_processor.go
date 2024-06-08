package processors

import (
	"encoding/json"
	"tml-extension-server/models"
)

func PlayerStatsProcessor(body []byte) ([]byte, error) {
	var playerStatsResponse models.PlayerStatsResponse
	if err := json.Unmarshal(body, &playerStatsResponse); err != nil {
		return nil, err
	}

	var filteredResponse models.FilteredPlayerStatsResponse
	for _, playerStats := range playerStatsResponse.PlayerStats {
		filteredPlayerStats := models.PlayerStats{
			Assists:  playerStats.Assists,
			Goals:    playerStats.Goals,
			Points:   playerStats.Points,
			Name:     playerStats.Name,
			Position: playerStats.Position,
		}
		filteredResponse.PlayersStats = append(filteredResponse.PlayersStats, filteredPlayerStats)
	}

	return json.Marshal(filteredResponse)
}
