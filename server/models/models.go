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

type PlayerStats struct {
	Assists int    `json:"assists"`
	Goals   int    `json:"goals"`
	Points  int    `json:"points"`
	Name    string `json:"skaterFullName"`
}

type PlayerStatsResponse struct {
	PlayerStats []PlayerStats `json:"data"`
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

type FilteredPlayerStatsResponse struct {
	PlayersStats []PlayerStats `json:"playerStats"`
}

type CombinedPlayersAndGamesResponse struct {
	Games       []FilteredGame `json:"games"`
	PlayerStats []PlayerStats  `json:"playerStats"`
}
