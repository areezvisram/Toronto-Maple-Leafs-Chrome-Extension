package processors

import (
	"encoding/json"
	"sort"
	"tml-extension-server/models"
)

func StandingsProcessor(body []byte) ([]byte, error) {
	var standingsResponse models.StandingsResponse
	if err := json.Unmarshal(body, &standingsResponse); err != nil {
		return nil, err
	}

	var divisionA, conferenceE, league []models.TeamPoints

	for _, team := range standingsResponse.Standings {
		filteredTeam := models.FilteredStandings{
			Team:           team.Team.Default,
			TeamLogo:       team.TeamLogo,
			Points:         team.Points,
			Conference:     team.Conference,
			Division:       team.Division,
			ConferenceRank: team.ConferenceRank,
			DivisionRank:   team.DivisionRank,
			LeagueRank:     team.LeagueRank,
		}
		league = append(league, models.TeamPoints{Team: filteredTeam.Team, Points: filteredTeam.Points})
		if team.Division == "A" {
			divisionA = append(divisionA, models.TeamPoints{Team: filteredTeam.Team, Points: filteredTeam.Points})
		}
		if team.Conference == "E" {
			conferenceE = append(conferenceE, models.TeamPoints{Team: filteredTeam.Team, Points: filteredTeam.Points})
		}
	}

	// Sort the lists by points in descending order
	sort.Slice(divisionA, func(i, j int) bool {
		return divisionA[i].Points > divisionA[j].Points
	})
	sort.Slice(conferenceE, func(i, j int) bool {
		return conferenceE[i].Points > conferenceE[j].Points
	})
	sort.Slice(league, func(i, j int) bool {
		return league[i].Points > league[j].Points
	})

	// Create the response object
	response := models.SortedStandingsResponse{
		Division:   divisionA,
		Conference: conferenceE,
		League:     league,
	}

	return json.Marshal(response)
}
