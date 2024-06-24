package processors

import (
	"encoding/json"
	"tml-extension-server/models"
)

func GoalieStatsProcessor(body []byte) ([]byte, error) {
	var goalieStatsResponse models.GoalieStatsResponse
	if err := json.Unmarshal(body, &goalieStatsResponse); err != nil {
		return nil, err
	}

	var filteredResponse models.FilteredGoalieStatsResponse
	for _, goalieStats := range goalieStatsResponse.GoalieStats {
		filteredGoalieStats := models.GoalieStats{
			Wins: goalieStats.Wins,
			Name: goalieStats.Name,
		}
		filteredResponse.GoalieStats = append(filteredResponse.GoalieStats, filteredGoalieStats)
	}

	return json.Marshal(filteredResponse)
}
