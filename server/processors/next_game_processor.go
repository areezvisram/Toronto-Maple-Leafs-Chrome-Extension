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
	if nextGameResponse.Games[0].GameState == "OFF" {
		filteredResponse.PreviousGame = models.FilteredPreviousGame{
			GameDate:      nextGameResponse.Games[0].GameDate,
			AwayTeam:      nextGameResponse.Games[0].AwayTeam.PlaceName.Default,
			HomeTeam:      nextGameResponse.Games[0].HomeTeam.PlaceName.Default,
			AwayTeamLogo:  nextGameResponse.Games[0].AwayTeam.Logo,
			HomeTeamLogo:  nextGameResponse.Games[0].HomeTeam.Logo,
			AwayTeamScore: nextGameResponse.Games[0].AwayTeam.Score,
			HomeTeamScore: nextGameResponse.Games[0].HomeTeam.Score,
		}
		filteredResponse.NextGame = models.FilteredNextGame{
			GameDate:     nextGameResponse.Games[1].GameDate,
			AwayTeam:     nextGameResponse.Games[1].AwayTeam.PlaceName.Default,
			HomeTeam:     nextGameResponse.Games[1].HomeTeam.PlaceName.Default,
			AwayTeamLogo: nextGameResponse.Games[1].AwayTeam.Logo,
			HomeTeamLogo: nextGameResponse.Games[1].HomeTeam.Logo,
		}
	} else if nextGameResponse.Games[0].GameState == "FUT" {
		filteredResponse.NextGame = models.FilteredNextGame{
			GameDate:     nextGameResponse.Games[0].GameDate,
			AwayTeam:     nextGameResponse.Games[0].AwayTeam.PlaceName.Default,
			HomeTeam:     nextGameResponse.Games[0].HomeTeam.PlaceName.Default,
			AwayTeamLogo: nextGameResponse.Games[0].AwayTeam.Logo,
			HomeTeamLogo: nextGameResponse.Games[0].HomeTeam.Logo,
		}
	}
	filteredResponse.PreviousStartDate = nextGameResponse.PreviousStartDate

	return json.Marshal(filteredResponse)
}
