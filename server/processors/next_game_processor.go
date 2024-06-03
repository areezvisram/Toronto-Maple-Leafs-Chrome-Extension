package processors

import (
	"encoding/json"
	"tml-extension-server/models"
)

func NHLGameProcessor(body []byte) ([]byte, error) {
	var nextGameResponse models.NextGameResponse
	if err := json.Unmarshal(body, &nextGameResponse); err != nil {
		return nil, err
	}

	var filteredResponse models.FilteredResponse
	for _, game := range nextGameResponse.Games {
		filteredGame := models.FilteredGame{
			GameDate:     game.GameDate,
			AwayTeam:     game.AwayTeam.PlaceName.Default,
			HomeTeam:     game.HomeTeam.PlaceName.Default,
			AwayTeamLogo: game.AwayTeam.Logo,
			HomeTeamLogo: game.HomeTeam.Logo,
		}
		filteredResponse.Games = append(filteredResponse.Games, filteredGame)
	}

	return json.Marshal(filteredResponse)
}
