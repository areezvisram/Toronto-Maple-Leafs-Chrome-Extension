package models

type Team struct {
	PlaceName struct {
		Default string `json:"default"`
	} `json:"placeName"`
	Logo  string `json:"logo"`
	Score int    `json:"score"`
}

type Game struct {
	GameDate  string `json:"gameDate"`
	AwayTeam  Team   `json:"awayTeam"`
	HomeTeam  Team   `json:"homeTeam"`
	GameState string `json:"gameState"`
}

type NextGameResponse struct {
	Games             []Game `json:"games"`
	PreviousStartDate string `json:"previousStartDate"`
}

type PlayerStats struct {
	Assists  int    `json:"assists"`
	Goals    int    `json:"goals"`
	Points   int    `json:"points"`
	Name     string `json:"skaterFullName"`
	Position string `json:"positionCode"`
}

type PlayerStatsResponse struct {
	PlayerStats []PlayerStats `json:"data"`
}

type StandingsTeamName struct {
	Default string `json:"default"`
}

type Standings struct {
	Team           StandingsTeamName `json:"teamName"`
	TeamLogo       string            `json:"teamLogo"`
	Points         int               `json:"points"`
	Conference     string            `json:"conferenceAbbrev"`
	ConferenceRank int               `json:"conferenceSequence"`
	Division       string            `json:"divisionAbbrev"`
	DivisionRank   int               `json:"divisionSequence"`
	LeagueRank     int               `json:"leagueSequence"`
}

type FilteredStandings struct {
	Team           string `json:"teamName"`
	TeamLogo       string `json:"teamLogo"`
	Points         int    `json:"points"`
	Conference     string `json:"conferenceAbbrev"`
	ConferenceRank int    `json:"conferenceSequence"`
	Division       string `json:"divisionAbbrev"`
	DivisionRank   int    `json:"divisionSequence"`
	LeagueRank     int    `json:"leagueSequence"`
}

type StandingsResponse struct {
	Standings []Standings `json:"standings"`
}

type FilteredGame struct {
	GameDate     string `json:"gameDate"`
	AwayTeam     string `json:"awayTeam"`
	HomeTeam     string `json:"homeTeam"`
	AwayTeamLogo string `json:"awayTeamLogo"`
	HomeTeamLogo string `json:"homeTeamLogo"`
}

type FilteredNextGame struct {
	GameDate     string `json:"gameDate"`
	AwayTeam     string `json:"awayTeam"`
	HomeTeam     string `json:"homeTeam"`
	AwayTeamLogo string `json:"awayTeamLogo"`
	HomeTeamLogo string `json:"homeTeamLogo"`
}

type FilteredPreviousGame struct {
	GameDate      string `json:"gameDate"`
	AwayTeam      string `json:"awayTeam"`
	HomeTeam      string `json:"homeTeam"`
	AwayTeamScore int    `json:"awayTeamScore"`
	HomeTeamScore int    `json:"homeTeamScore"`
	AwayTeamLogo  string `json:"awayTeamLogo"`
	HomeTeamLogo  string `json:"homeTeamLogo"`
}

// type FilteredResponse struct {
// 	Games []FilteredGame `json:"games"`
// }

type FilteredResponse struct {
	PreviousGame      FilteredPreviousGame `json:"previousGame"`
	NextGame          FilteredNextGame     `json:"nextGame"`
	PreviousStartDate string               `json:"previousStartDate"`
}

type FilteredPlayerStatsResponse struct {
	PlayersStats []PlayerStats `json:"playerStats"`
}

type FilteredStandingsResponse struct {
	Standings []FilteredStandings `json:"standings"`
}

type CombinedPlayersAndGamesResponse struct {
	// Games       []FilteredGame `json:"games"`
	PreviousStartDate string               `json:"previousStartDate"`
	PreviousGame      FilteredPreviousGame `json:"previousGame"`
	NextGame          FilteredNextGame     `json:"nextGame"`
	PlayerStats       []PlayerStats        `json:"playerStats"`
}

type SortedStandingsResponse struct {
	Division   []TeamPoints `json:"division"`
	Conference []TeamPoints `json:"conference"`
	League     []TeamPoints `json:"league"`
}

type TeamPoints struct {
	Team     string `json:"team"`
	TeamLogo string `json:"teamLogo"`
	Points   int    `json:"points"`
}
