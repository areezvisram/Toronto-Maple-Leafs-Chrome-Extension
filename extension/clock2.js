/*
Created by: Areez Visram
Name: Toronto Maple Leafs Chrome Extension
Copyright (C): Areez Visram - All Rights Reserved
*/

//=================================================================================================================
// Class Declaration
class Player {
    constructor(playerName, gamesPlayed, goals, assists, points) {
        this.playerName = playerName;
        this.gamesPlayed = gamesPlayed;
        this.goals = goals;
        this.assists = assists;
        this.points = points;
    }
}

class Goalie {
    constructor(playerName, wins) {
        this.playerName = playerName;
        this.wins = wins;
    }
}
//=================================================================================================================
// All functions executed on load
window.addEventListener("load", function () {

    // Randomize background from 8 images
    var bg = document.getElementById("bg");
    var random = Math.round(Math.random() * (5 - 1) + 1);
    bg.style.backgroundImage = "url('images/background" + random + ".jpg')";

    //=================================================================================================================
    // Function to calculate date and time
    function doDate() {
        var now = new Date();

        // Getting hours
        if (now.getHours().toString().length == 1) {
            document.getElementById("hours").innerHTML = "0" + now.getHours();
        } else {
            document.getElementById("hours").innerHTML = now.getHours();
        }

        // Getting minutes
        if (now.getMinutes().toString().length == 1) {
            document.getElementById("minutes").innerHTML = "0" + now.getMinutes();
        } else {
            document.getElementById("minutes").innerHTML = now.getMinutes();
        }

        // Getting months
        var month = now.getMonth() + 1;
        if (month.toString().length == 1) {
            document.getElementById("month").innerHTML = "0" + month;
        } else {
            document.getElementById("month").innerHTML = month;
        }

        // Getting date
        if (now.getDate().toString().length == 1) {
            document.getElementById("day").innerHTML = "0" + now.getDate();
        } else {
            document.getElementById("day").innerHTML = now.getDate();
        }
    }

    let nextGameData = [];
    let previousGameData = [];
    let playerStatsData = [];
    let goalieStatsData = [];
    let divisionStandingsData = [];
    let conferenceStandingsData = [];
    let leagueStandingsData = [];

    // async function getTopScorers(stat, position)
    async function getStatsAndSchedule() {
        const response = await fetch("https://tml-chrome-extension-server-401328305809.us-east1.run.app/api/nhl-schedule");
        const data = await response.json();
        nextGameData = data["nextGame"];
        previousGameData = data["previousGame"];
        playerStatsData = data["playerStats"];
        goalieStatsData = data["goalieStats"];
    }

    async function getStandings() {
        const response = await fetch("https://tml-chrome-extension-server-401328305809.us-east1.run.app/api/standings");
        const data = await response.json();
        divisionStandingsData = data["division"];
        conferenceStandingsData = data["conference"];
        leagueStandingsData = data["league"];
    }

    async function setStats(stat, def = false, goalie = false) {
        console.log(playerStatsData);
        console.log(goalieStatsData);        
        if (playerStatsData == null & goalieStatsData == null) {
            document.getElementById("top-scorers").style.display = "none";
            document.getElementById("season-not-started").style.display = "block";
            return
        }
        let players = [];
        const container = document.querySelector('.top-scorers-container');
        const currentScorers = container.querySelectorAll('.top-scorers');
        currentScorers.forEach(scorer => scorer.remove());
        if (goalie) {
            for (i in goalieStatsData) {
                let g = new Goalie(
                    goalieStatsData[i].goalieFullName,
                    goalieStatsData[i].wins
                )
                players.push(g)
            }
        } else {
            for (i in playerStatsData) {
                if (def && playerStatsData[i].positionCode !== "D") {
                    continue;
                }
                let p = new Player(
                    playerStatsData[i].skaterFullName,
                    82,
                    playerStatsData[i].goals,
                    playerStatsData[i].assists,
                    playerStatsData[i].points
                )
                players.push(p)
            }
            players = players.sort((a, b) => b[stat] - a[stat]);
        }


        players.forEach(player => {
            const scorerDiv = document.createElement('div');
            scorerDiv.className = 'top-scorers';
            scorerDiv.innerHTML = `${player.playerName.toUpperCase()}: ${player[stat]}`;
            container.appendChild(scorerDiv);
        });
    }

    async function setNextGame() {
        let nextGameDate = nextGameData["gameDate"];
        if (nextGameDate == "") {
            document.getElementById("next-game").style.display = "none";
            document.getElementById("season-over").style.display = "block";
        }
        document.getElementById("next-game-date").innerHTML = "DATE: " + nextGameDate;
        let nextGameAway = nextGameData["awayTeam"];
        document.getElementById("next-game-away").innerHTML = nextGameAway.toUpperCase();
        let nextGameHome = nextGameData["homeTeam"];
        document.getElementById("next-game-home").innerHTML = nextGameHome.toUpperCase();
        let nextGameAwayLogoSrc = nextGameData["awayTeamLogo"];
        document.getElementById("next-away-team-logo").src = nextGameAwayLogoSrc;
        let nextGameHomeLogoSrc = nextGameData["homeTeamLogo"];
        document.getElementById("next-home-team-logo").src = nextGameHomeLogoSrc;

        // get the record of both teams from the "record" field of the league standings data
        let awayTeamRecord = leagueStandingsData.find(team => team.team === nextGameAway);
        let homeTeamRecord = leagueStandingsData.find(team => team.team === nextGameHome);
        document.getElementById("next-game-home-record").innerHTML = homeTeamRecord.record;
        document.getElementById("next-game-away-record").innerHTML = awayTeamRecord.record;
    }

    async function setPreviousGame() {
        let lastGameDate = previousGameData["gameDate"];
        document.getElementById("last-game-date").innerHTML = "DATE: " + lastGameDate;
        let lastGameAway = previousGameData["awayTeam"];
        document.getElementById("last-game-away").innerHTML = lastGameAway.toUpperCase();
        let lastGameHome = previousGameData["homeTeam"];
        document.getElementById("last-game-home").innerHTML = lastGameHome.toUpperCase();
        let lastGameAwayLogoSrc = previousGameData["awayTeamLogo"];
        document.getElementById("last-away-team-logo").src = lastGameAwayLogoSrc;
        let lastGameHomeLogoSrc = previousGameData["homeTeamLogo"];
        document.getElementById("last-home-team-logo").src = lastGameHomeLogoSrc;
        let lastGameAwayScore = previousGameData["awayTeamScore"];
        document.getElementById("last-game-away-score").innerHTML = lastGameAwayScore;
        let lastGameHomeScore = previousGameData["homeTeamScore"];
        document.getElementById("last-game-home-score").innerHTML = lastGameHomeScore;

        let awayTeamRecord = leagueStandingsData.find(team => team.team === lastGameAway);
        let homeTeamRecord = leagueStandingsData.find(team => team.team === lastGameHome);
        document.getElementById("last-game-home-record").innerHTML = homeTeamRecord.record;
        document.getElementById("last-game-away-record").innerHTML = awayTeamRecord.record;
    }

    async function setStandings(filter) {
        var allPositions = document.getElementsByClassName("standings-position");
        var allLogos = document.getElementsByClassName("standings-logo");
        var allPoints = document.getElementsByClassName("standings-points");
        var container = document.getElementById("standings-container");
        while (allPositions[0]) {
            allPositions[0].parentNode.removeChild(allPositions[0]);
            allLogos[0].parentNode.removeChild(allLogos[0]);
            allPoints[0].parentNode.removeChild(allPoints[0]);
        }

        // Select the appropriate data source based on the filter
        let standingsData;
        if (filter === "division") {
            standingsData = divisionStandingsData;
        } else if (filter === "conference") {
            standingsData = conferenceStandingsData;
        } else if (filter === "league") {
            standingsData = leagueStandingsData;
        }

        for (i in standingsData) {
            let teamLogo = document.createElement("img");
            teamLogo.className = "standings-logo";
            teamLogo.src = standingsData[i].teamLogo;
            let teamPoints = document.createElement("div");
            teamPoints.className = "standings-points";
            teamPoints.innerHTML = "- " + standingsData[i].points + " PTS";
            let teamPosition = document.createElement("div");
            teamPosition.className = "standings-position";
            let position = parseInt(i) + 1;
            teamPosition.innerHTML = position + ". ";
            container.appendChild(teamPosition);
            container.appendChild(teamLogo);
            container.appendChild(teamPoints);
        }
    }

    // Dropdown button and menu configuration 
    document.getElementById("dropdown-button").onclick = function () {
        document.getElementById("dropdown-content").style.display = "block";
    };

    document.getElementById("standings-dropdown-button").onclick = function () {
        document.getElementById("standings-dropdown-content").style.display = "block";
    };

    window.onclick = function (event) {
        if (!event.target.matches(".dropdown-button")) {
            document.getElementById("dropdown-content").style.display = "none";
        }
        if (!event.target.matches("#standings-dropdown-button")) {
            document.getElementById("standings-dropdown-content").style.display = "none";
        }
    };

    let goals = document.getElementById("goals");
    goals.onclick = function () {
        setStats("goals");
        document.getElementById("dropdown-button").innerHTML = "GOALS &#9660";
    };

    let points = document.getElementById("points");
    points.onclick = function () {
        setStats("points");
        document.getElementById("dropdown-button").innerHTML = "POINTS &#9660";
    };

    let assists = document.getElementById("assists");
    assists.onclick = function () {
        setStats("assists");
        document.getElementById("dropdown-button").innerHTML = "ASSISTS &#9660";
    };

    let def = document.getElementById("def");
    def.onclick = function () {
        setStats("points", def = true);
        document.getElementById("dropdown-button").innerHTML = "DEFENSEMEN &#9660";
    };

    let tend = document.getElementById("tend");
    tend.onclick = function () {
        // setStats("points", def = true, goalie = true);
        setStats("wins", def = false, goalie = true);
        document.getElementById("dropdown-button").innerHTML = "GOALIE WINS &#9660";
    };

    let division = document.getElementById("division");
    division.onclick = function () {
        setStandings("division");
        document.getElementById("standings-dropdown-button").innerHTML = "DIVISION &#9660";
    };

    let conf = document.getElementById("conference");
    conf.onclick = function () {
        setStandings("conference");
        document.getElementById("standings-dropdown-button").innerHTML = "CONFERENCE &#9660";
    };

    let league = document.getElementById("league");
    league.onclick = function () {
        setStandings("league");
        document.getElementById("standings-dropdown-button").innerHTML = "LEAGUE &#9660";
    };


    // Perform all the functions on window load to show the desired screen
    setInterval(doDate, 1000);
    // getNextGame();
    getStandings().then(() => {
        setStandings("division");
    });
    getStatsAndSchedule().then(() => {
        setStats("points");
        setNextGame();
        setPreviousGame();
    });
});