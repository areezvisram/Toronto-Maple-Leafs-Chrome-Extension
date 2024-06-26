package processors

import (
	"encoding/json"
	"fmt"
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
		if team.Team.Default == "Tampa Bay" {
			team.TeamLogo = "https://assets.nhle.com/logos/nhl/svg/TBL_dark.svg"
		}
		filteredTeam := models.FilteredStandings{
			Team:           team.Team.Default,
			TeamLogo:       team.TeamLogo,
			Points:         team.Points,
			Conference:     team.Conference,
			Division:       team.Division,
			ConferenceRank: team.ConferenceRank,
			DivisionRank:   team.DivisionRank,
			LeagueRank:     team.LeagueRank,
			Record:         fmt.Sprintf("%d-%d-%d", team.Wins, team.Losses, team.OTLosses),
		}
		league = append(league, models.TeamPoints{Team: filteredTeam.Team, TeamLogo: filteredTeam.TeamLogo, Points: filteredTeam.Points, Record: filteredTeam.Record})
		if team.Division == "A" {
			divisionA = append(divisionA, models.TeamPoints{Team: filteredTeam.Team, TeamLogo: filteredTeam.TeamLogo, Points: filteredTeam.Points})
		}
		if team.Conference == "E" {
			conferenceE = append(conferenceE, models.TeamPoints{Team: filteredTeam.Team, TeamLogo: filteredTeam.TeamLogo, Points: filteredTeam.Points})
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
