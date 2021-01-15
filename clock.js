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
  var random = Math.round(Math.random() * (8 - 1) + 1);
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

  //=================================================================================================================
  // Function to get and show next Leafs game data
  async function getNextGame() {

    // Request and JSON object
    const nextGameRequest = await fetch("https://statsapi.web.nhl.com/api/v1/teams/10?expand=team.schedule.next");
    let nextGameResponse = await nextGameRequest.json();
    let nextGameExists = true;

    // Making sure there is a next game (not end of season)
    try {

      // Getting next game away team
      let nextGameDate = nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0]["date"];
      document.getElementById("next-game-date").innerHTML = "DATE: " + nextGameDate;
      let nextGameAway = nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0]["games"][0]["teams"]["away"]["team"]["name"];
      console.log(nextGameAway)
      if (nextGameAway.includes('Canadiens')) {
        nextGameAway = "Montreal Canadiens";
      }
      document.getElementById("next-game-away").innerHTML = nextGameAway.toUpperCase();

      // Geting next game away team record
      let nextGameAwayWins = nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0]["games"][0]["teams"]["away"]["leagueRecord"]["wins"];
      let nextGameAwayLosses = nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0]["games"][0]["teams"]["away"]["leagueRecord"]["losses"];
      let nextGameAwayOT = nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0]["games"][0]["teams"]["away"]["leagueRecord"]["ot"];
      let nextGameAwayRecord = nextGameAwayWins + "-" + nextGameAwayLosses + "-" + nextGameAwayOT;
      document.getElementById("next-game-away-record").innerHTML = nextGameAwayRecord;

      // Getting next game home team 
      let nextGameHome = nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0]["games"][0]["teams"]["home"]["team"]["name"];
      if (nextGameHome.includes('Canadiens')) {
        nextGameHome = "Montreal Canadiens";
      }
      document.getElementById("next-game-home").innerHTML = nextGameHome.toUpperCase();

      // Getting next game home team record
      let nextGameHomeWins = nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0]["games"][0]["teams"]["home"]["leagueRecord"]["wins"];
      let nextGameHomeLosses = nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0]["games"][0]["teams"]["home"]["leagueRecord"]["losses"];
      let nextGameHomeOT = nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0]["games"][0]["teams"]["home"]["leagueRecord"]["ot"];
      let nextGameHomeRecord = nextGameHomeWins + "-" + nextGameHomeLosses + "-" + nextGameHomeOT;
      document.getElementById("next-game-home-record").innerHTML = nextGameHomeRecord;

      // Getting next game away logo      
      let nextGameAwayLogoSrc = "images/teams/" + nextGameAway + ".png";
      document.getElementById("next-away-team-logo").src = nextGameAwayLogoSrc;

      // Getting next game home logo
      let nextGameHomeLogoSrc = "images/teams/" + nextGameHome + ".png";
      document.getElementById("next-home-team-logo").src = nextGameHomeLogoSrc;

    } catch (error) {
      nextGameExists = false;
    }

    // If end of season, show that there is no next game
    if (nextGameExists == false) {
      document.getElementById("next-game").style.display = "none";
      document.getElementById("season-over").style.display = "block";
    }
  }

  //=================================================================================================================
  // Function to get last Leafs game data
  async function getLastGame() {
    
    // Request and JSON object
    const lastGameRequest = await fetch("https://statsapi.web.nhl.com/api/v1/teams/10?expand=team.schedule.previous");
    let lastGameResponse = await lastGameRequest.json();
    let lastGameDate = lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0]["date"];
    document.getElementById("last-game-date").innerHTML = "DATE: " + lastGameDate;

    // Getting last game away team
    let lastGameAway = lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0]["games"][0]["teams"]["away"]["team"]["name"];
    if (lastGameAway.includes('Canadiens')) {
      lastGameAway = "Montreal Canadiens";
    }
    document.getElementById("last-game-away").innerHTML = lastGameAway.toUpperCase();

    // Getting last game away team record
    let lastGameAwayWins = lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0]["games"][0]["teams"]["away"]["leagueRecord"]["wins"];
    let lastGameAwayLosses = lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0]["games"][0]["teams"]["away"]["leagueRecord"]["losses"];
    let lastGameAwayOT = lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0]["games"][0]["teams"]["away"]["leagueRecord"]["ot"];
    let lastGameAwayRecord = lastGameAwayWins + "-" + lastGameAwayLosses + "-" + lastGameAwayOT;
    document.getElementById("last-game-away-record").innerHTML = lastGameAwayRecord;

    // Getting last game home team record
    let lastGameHomeWins = lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0]["games"][0]["teams"]["home"]["leagueRecord"]["wins"];
    let lastGameHomeLosses = lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0]["games"][0]["teams"]["home"]["leagueRecord"]["losses"];
    let lastGameHomeOT = lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0]["games"][0]["teams"]["home"]["leagueRecord"]["ot"];
    let lastGameHomeRecord = lastGameHomeWins + "-" + lastGameHomeLosses + "-" + lastGameHomeOT;
    document.getElementById("last-game-home-record").innerHTML = lastGameHomeRecord;

    // Getting last game home team
    let lastGameHome = lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0]["games"][0]["teams"]["home"]["team"]["name"];
    if (lastGameHome.includes('Canadiens')) {
      lastGameHome = "Montreal Canadiens";
    }
    document.getElementById("last-game-home").innerHTML = lastGameHome.toUpperCase();

    // Getting last game away team score
    let lastGameAwayScore = lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0]["games"][0]["teams"]["away"]["score"];
    document.getElementById("last-game-away-score").innerHTML = lastGameAwayScore;

    // Getting last game home team score
    let lastGameHomeScore = lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0]["games"][0]["teams"]["home"]["score"];
    document.getElementById("last-game-home-score").innerHTML = lastGameHomeScore;

    // Getting last game away team logo
    let lastGameAwayLogoSrc = "images/teams/" + lastGameAway + ".png";
    document.getElementById("last-away-team-logo").src = lastGameAwayLogoSrc;

    // Getting last game home team logo
    let lastGameHomeLogoSrc = "images/teams/" + lastGameHome + ".png";
    document.getElementById("last-home-team-logo").src = lastGameHomeLogoSrc;
  }

  //=================================================================================================================
  // Function to get Leafs top scorers, takes two arguments, stat and position
  let playerArray = [];
  async function getTopScorers(stat, position) {
    let top = [];
    let topUnsorted = [];
    let playerArray = [];

    // Request and JSON object
    const leafsRosterRequest = await fetch("https://statsapi.web.nhl.com/api/v1/teams/10/roster");
    let leafsRosterResponse = await leafsRosterRequest.json();
    let leafsRoster = leafsRosterResponse["roster"];

    // Stats to show if user wishes to filter by defense
    if (position == "def") {

      // Delete all players that are not defensemen from the roster object
      for (let i = 0; i < leafsRoster.length; i++) {
        if (leafsRoster[i]["position"]["abbreviation"] != "D") {
          delete leafsRoster[i];
        }
      }
    } 
    
    // Stats to show if user wishes to filter by goaltenders
    else if (position == "tend") {

      // Delete all players that are not goaltenders from the roster object
      for (let i = 0; i < leafsRoster.length; i++) {
        if (leafsRoster[i]["position"]["abbreviation"] != "G") {
          delete leafsRoster[i];
        }
      }
    }

    // Get the stats for each player on the roster
    for (let i = 0; i < leafsRoster.length; i++) {
      if (leafsRoster[i] != undefined) {
        let playerLink = leafsRoster[i]["person"]["link"];
        let playerName = leafsRoster[i]["person"]["fullName"];

        // Individual player request and JSON object
        let playerStatsRequest = await fetch("https://statsapi.web.nhl.com/" + playerLink + "/stats?stats=statsSingleSeason&season=20202021");
        let playerStatsResponse = await playerStatsRequest.json();
        try {
          playerStats = playerStatsResponse["stats"][0]["splits"][0]["stat"];
        } catch (error) {
          playerStats = -1;
        } finally {
          if (playerStats != -1) {

            // If the player has stats, create a new Player object with the stats
            const stats = Object.keys(playerStats);
            if (stats[1] == "assists") {
              let gamesPlayed = playerStats["games"];
              let goals = playerStats["goals"];
              let assists = playerStats["assists"];
              let points = playerStats["points"];
              let p = new Player(
                playerName,
                gamesPlayed,
                goals,
                assists,
                points
              );
              playerArray.push(p);
            } 
            // If not a player then create a new Goalie object with goalie stats
            else {
              let wins = playerStats["wins"];
              let g = new Goalie(playerName, wins);
              playerArray.push(g);
            }
          }
        }
      }
    }

    // Algorithm to sort the roster from highest to lowest of desired stat
    for (let i = 0; i < playerArray.length; i++) {
      top.push(playerArray[i][stat]);
      topUnsorted.push(playerArray[i][stat]);
    }

    top.sort(function (a, b) {
      return b - a;
    });

    let topPlayers = [];
    for (let i = 0; i < top.length; i++) {
      for (let j = 0; j < topUnsorted.length; j++) {
        if (top[i] == topUnsorted[j]) {
          topPlayers.push(playerArray[j]);
          delete topUnsorted[j];
        }
      }
    }

    // Show goalies if desired
    if (position == "tend") {
      for (let i = 1; i < 7; i++) {
        document.getElementById(i).innerHTML = "";
      }

      // Show only one goalie if only one goalie has stats
      if (topPlayers.length == 1) {
        let name = topPlayers[0]["playerName"];
        let total = topPlayers[0][stat];
        document.getElementById(1).innerHTML = name.toUpperCase() + ": " + total;
      } 
      else {
        for (let i = 1; i < 5; i++) {
          let name = topPlayers[i - 1]["playerName"];
          let total = topPlayers[i - 1][stat];
          document.getElementById(i).innerHTML =  name.toUpperCase() + ": " + total;
        }
      }
    } 
    
    // Show players if desired
    else {
      console.log(topPlayers);
      for (let i = 1; i < 7; i++) {
        let name = topPlayers[i - 1]["playerName"];
        let total = topPlayers[i - 1][stat];
        document.getElementById(i).innerHTML =  name.toUpperCase() + ": " + total;
      }
    }
  }

//=================================================================================================================
// Function to get NHL standings
  async function getStandings(filter) {

    // Clear current standings when function is called to show new standings
    var allPositions = document.getElementsByClassName("standings-position");
    var allLogos = document.getElementsByClassName("standings-logo");
    var allPoints = document.getElementsByClassName("standings-points");
    var container = document.getElementById("standings-container");
    while (allPositions[0]) {
      allPositions[0].parentNode.removeChild(allPositions[0]);
      allLogos[0].parentNode.removeChild(allLogos[0]);
      allPoints[0].parentNode.removeChild(allPoints[0]);
    }

    // Show division stats if desired
    if (filter == "division") {

      // Request and JSON object
      const divisionStandingsRequest = await fetch("https://statsapi.web.nhl.com/api/v1/standings");
      let divisionStandingsResponse = await divisionStandingsRequest.json();
      let divisionStandingsArray = divisionStandingsResponse["records"][3]["teamRecords"];      
      var container = document.getElementById("standings-container");

      // For each team in the division, get and show name, logo and points
      for (let i = 0; i < divisionStandingsArray.length; i++) {
        var teamLogo = document.createElement("img");
        teamLogo.className = "standings-logo";
        var teamName = divisionStandingsArray[i]["team"]["name"];
        if (teamName.includes('Canadiens')) {
          teamLogo.src = "images/teams/Montreal Canadiens.png";
        }
        else {
          teamLogo.src = "images/teams/" + teamName + ".png";
        }
        var teamPoints = document.createElement("div");
        teamPoints.className = "standings-points";
        teamPoints.innerHTML = "- " + divisionStandingsArray[i]["points"] + " PTS";

        var teamPosition = document.createElement("div");
        teamPosition.className = "standings-position";
        let position = (i + 1).toString();
        teamPosition.innerHTML = position + ". ";
        container.appendChild(teamPosition);
        container.appendChild(teamLogo);
        container.appendChild(teamPoints);
      }
    } 
    
    // Show conference stats if desired
    else if (filter == "conf") {

      // Request and JSON object
      const confStandingsRequest = await fetch("https://statsapi.web.nhl.com/api/v1/standings/byConference");
      let confStandingsResponse = await confStandingsRequest.json();
      let confStandingsArray = confStandingsResponse["records"][0]["teamRecords"];
      var container = document.getElementById("standings-container");

      // For each team in conference, get and show name, logo and points
      for (let i = 0; i < confStandingsArray.length; i++) {
        var teamLogo = document.createElement("img");
        teamLogo.className = "standings-logo";
        let teamName = confStandingsArray[i]["team"]["name"];
        if (teamName.includes('Canadiens')) {
          teamLogo.src = "images/teams/Montreal Canadiens.png";
        }
        else {
          teamLogo.src = "images/teams/" + teamName + ".png";
        }
        var teamPoints = document.createElement("div");
        teamPoints.className = "standings-points";
        teamPoints.innerHTML = "- " + confStandingsArray[i]["points"] + " PTS";

        var teamPosition = document.createElement("div");
        teamPosition.className = "standings-position";
        let position = (i + 1).toString();
        teamPosition.innerHTML = position + ". ";
        container.appendChild(teamPosition);
        container.appendChild(teamLogo);
        container.appendChild(teamPoints);
      }
    } 
    
    // Show league stats if desired
    else if (filter == "league") {

      // Request and JSON object
      const leagueStandingsRequest = await fetch("https://statsapi.web.nhl.com/api/v1/standings/byLeague");
      let leagueStandingsResponse = await leagueStandingsRequest.json();
      let leagueStandingsArray = leagueStandingsResponse["records"][0]["teamRecords"];
      var container = document.getElementById("standings-container");

      // For each team in league, get and show name, logo and points
      for (let i = 0; i < leagueStandingsArray.length; i++) {
        var teamLogo = document.createElement("img");
        teamLogo.className = "standings-logo";
        let teamName = leagueStandingsArray[i]["team"]["name"];
        if (teamName.includes('Canadiens')) {
          teamLogo.src = "images/teams/Montreal Canadiens.png";
        }
        else {
          teamLogo.src = "images/teams/" + teamName + ".png";
        }
        var teamPoints = document.createElement("div");
        teamPoints.className = "standings-points";
        teamPoints.innerHTML = "- " + leagueStandingsArray[i]["points"] + " PTS";

        var teamPosition = document.createElement("div");
        teamPosition.className = "standings-position";
        let position = (i + 1).toString();
        teamPosition.innerHTML = position + ". ";
        container.appendChild(teamPosition);
        container.appendChild(teamLogo);
        container.appendChild(teamPoints);
      }
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

  // Show desired data when certain filters are clicked
  let goals = document.getElementById("goals");
  goals.onclick = function () {
    getTopScorers("goals");
    document.getElementById("dropdown-button").innerHTML = "GOALS &#9660";
  };

  let points = document.getElementById("points");
  points.onclick = function () {
    getTopScorers("points");
    document.getElementById("dropdown-button").innerHTML = "POINTS &#9660";
  };

  let assists = document.getElementById("assists");
  assists.onclick = function () {
    getTopScorers("assists");
    document.getElementById("dropdown-button").innerHTML = "ASSISTS &#9660";
  };

  let def = document.getElementById("def");
  def.onclick = function () {
    getTopScorers("points", "def");
    document.getElementById("dropdown-button").innerHTML = "DEFENSEMEN &#9660";
  };

  let tend = document.getElementById("tend");
  tend.onclick = function () {
    getTopScorers("wins", "tend");
    document.getElementById("dropdown-button").innerHTML = "GOALIE WINS &#9660";
  };

  let division = document.getElementById("division");
  division.onclick = function () {
    getStandings("division");
    document.getElementById("standings-dropdown-button").innerHTML = "DIVISION &#9660";
  };

  let conf = document.getElementById("conference");
  conf.onclick = function () {
    getStandings("conf");
    document.getElementById("standings-dropdown-button").innerHTML = "CONFERENCE &#9660";
  };

  let league = document.getElementById("league");
  league.onclick = function () {
    getStandings("league");
    document.getElementById("standings-dropdown-button").innerHTML = "LEAGUE &#9660";
  };

  // Perform all the functions on window load to show the desired screen
  getTopScorers("points");
  setInterval(doDate, 1000);
  getLastGame();
  getNextGame();
  getStandings("division");
});
