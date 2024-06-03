package models

type Team struct {
	PlaceName struct {
		Default string `json:"default"`
	} `json:"placeName"`
	Logo string `json:"logo"`
}

type Game struct {
	GameDate string `json:"gameDate"`
	AwayTeam Team   `json:"awayTeam"`
	HomeTeam Team   `json:"homeTeam"`
}

type NextGameResponse struct {
	Games []Game `json:"games"`
}

type FilteredGame struct {
	GameDate     string `json:"gameDate"`
	AwayTeam     string `json:"awayTeam"`
	HomeTeam     string `json:"homeTeam"`
	AwayTeamLogo string `json:"awayTeamLogo"`
	HomeTeamLogo string `json:"homeTeamLogo"`
}

type FilteredResponse struct {
	Games []FilteredGame `json:"games"`
}
