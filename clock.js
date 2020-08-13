class Player {
  constructor(
    playerName,
    gamesPlayed,
    goals,
    assists,
    points
    //position
  ) {
    this.playerName = playerName;
    // this.position = position;
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

window.addEventListener("load", function () {
  function doDate() {
    var now = new Date();

    if (now.getHours().toString().length == 1) {
      document.getElementById("hours").innerHTML = "0" + now.getHours();
    } else {
      document.getElementById("hours").innerHTML = now.getHours();
    }

    if (now.getMinutes().toString().length == 1) {
      document.getElementById("minutes").innerHTML = "0" + now.getMinutes();
    } else {
      document.getElementById("minutes").innerHTML = now.getMinutes();
    }

    var month = now.getMonth() + 1;

    if (month.toString().length == 1) {
      document.getElementById("month").innerHTML = "0" + month;
    } else {
      document.getElementById("month").innerHTML = month;
    }

    if (now.getDate().toString().length == 1) {
      document.getElementById("day").innerHTML = "0" + now.getDate();
    } else {
      document.getElementById("day").innerHTML = now.getDate();
    }
  }

  async function getNextGame() {
    const nextGameRequest = await fetch(
      "https://statsapi.web.nhl.com/api/v1/teams/10?expand=team.schedule.next"
    );
    let nextGameResponse = await nextGameRequest.json();
    let nextGameExists = true;
    try {
      let nextGameDate =
        nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0]["date"];
      document.getElementById("next-game-date").innerHTML =
        "DATE: " + nextGameDate;
      let nextGameAway =
        nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0][
          "games"
        ][0]["teams"]["away"]["team"]["name"];
      document.getElementById(
        "next-game-away"
      ).innerHTML = nextGameAway.toUpperCase();
      let nextGameAwayWins =
        nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0][
          "games"
        ][0]["teams"]["away"]["leagueRecord"]["wins"];
      let nextGameAwayLosses =
        nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0][
          "games"
        ][0]["teams"]["away"]["leagueRecord"]["losses"];
      let nextGameAwayOT =
        nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0][
          "games"
        ][0]["teams"]["away"]["leagueRecord"]["ot"];
      let nextGameAwayRecord =
        nextGameAwayWins + "-" + nextGameAwayLosses + "-" + nextGameAwayOT;
      document.getElementById(
        "next-game-away-record"
      ).innerHTML = nextGameAwayRecord;

      let nextGameHome =
        nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0][
          "games"
        ][0]["teams"]["home"]["team"]["name"];
      document.getElementById(
        "next-game-home"
      ).innerHTML = nextGameHome.toUpperCase();
      let nextGameHomeWins =
        nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0][
          "games"
        ][0]["teams"]["home"]["leagueRecord"]["wins"];
      let nextGameHomeLosses =
        nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0][
          "games"
        ][0]["teams"]["home"]["leagueRecord"]["losses"];
      let nextGameHomeOT =
        nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0][
          "games"
        ][0]["teams"]["home"]["leagueRecord"]["ot"];
      let nextGameHomeRecord =
        nextGameHomeWins + "-" + nextGameHomeLosses + "-" + nextGameHomeOT;
      document.getElementById(
        "next-game-home-record"
      ).innerHTML = nextGameHomeRecord;

      let nextGameAwayLogoSrc = "images/teams/" + nextGameAway + ".png";
      document.getElementById("next-away-team-logo").src = nextGameAwayLogoSrc;

      let nextGameHomeLogoSrc = "images/teams/" + nextGameHome + ".png";
      document.getElementById("next-home-team-logo").src = nextGameHomeLogoSrc;
    } catch (error) {
      nextGameExists = false;
    }
    if (nextGameExists == false) {
      document.getElementById("next-game").style.display = "none";
      document.getElementById("season-over").style.display = "block";
    }
  }

  async function getLastGame() {
    const lastGameRequest = await fetch(
      "https://statsapi.web.nhl.com/api/v1/teams/10?expand=team.schedule.previous"
    );
    let lastGameResponse = await lastGameRequest.json();
    console.log(lastGameResponse);

    let lastGameDate =
      lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0]["date"];
    document.getElementById("last-game-date").innerHTML =
      "DATE: " + lastGameDate;

    let lastGameAway =
      lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0][
        "games"
      ][0]["teams"]["away"]["team"]["name"];
    document.getElementById(
      "last-game-away"
    ).innerHTML = lastGameAway.toUpperCase();

    let lastGameAwayWins =
      lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0][
        "games"
      ][0]["teams"]["away"]["leagueRecord"]["wins"];
    let lastGameAwayLosses =
      lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0][
        "games"
      ][0]["teams"]["away"]["leagueRecord"]["losses"];
    let lastGameAwayOT =
      lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0][
        "games"
      ][0]["teams"]["away"]["leagueRecord"]["ot"];
    let lastGameAwayRecord =
      lastGameAwayWins + "-" + lastGameAwayLosses + "-" + lastGameAwayOT;
    document.getElementById(
      "last-game-away-record"
    ).innerHTML = lastGameAwayRecord;

    let lastGameHomeWins =
      lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0][
        "games"
      ][0]["teams"]["home"]["leagueRecord"]["wins"];
    let lastGameHomeLosses =
      lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0][
        "games"
      ][0]["teams"]["home"]["leagueRecord"]["losses"];
    let lastGameHomeOT =
      lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0][
        "games"
      ][0]["teams"]["home"]["leagueRecord"]["ot"];
    let lastGameHomeRecord =
      lastGameHomeWins + "-" + lastGameHomeLosses + "-" + lastGameHomeOT;
    document.getElementById(
      "last-game-home-record"
    ).innerHTML = lastGameHomeRecord;

    let lastGameHome =
      lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0][
        "games"
      ][0]["teams"]["home"]["team"]["name"];
    document.getElementById(
      "last-game-home"
    ).innerHTML = lastGameHome.toUpperCase();

    let lastGameAwayScore =
      lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0][
        "games"
      ][0]["teams"]["away"]["score"];
    document.getElementById(
      "last-game-away-score"
    ).innerHTML = lastGameAwayScore;

    let lastGameHomeScore =
      lastGameResponse["teams"][0]["previousGameSchedule"]["dates"][0][
        "games"
      ][0]["teams"]["home"]["score"];
    document.getElementById(
      "last-game-home-score"
    ).innerHTML = lastGameHomeScore;

    let lastGameAwayLogoSrc = "images/teams/" + lastGameAway + ".png";
    document.getElementById("last-away-team-logo").src = lastGameAwayLogoSrc;

    let lastGameHomeLogoSrc = "images/teams/" + lastGameHome + ".png";
    document.getElementById("last-home-team-logo").src = lastGameHomeLogoSrc;
  }

  let playerArray = [];
  async function getTopScorers(stat, position) {
    let top = [];
    let topUnsorted = [];
    let playerArray = [];
    const leafsRosterRequest = await fetch(
      "https://statsapi.web.nhl.com/api/v1/teams/10/roster"
    );
    let leafsRosterResponse = await leafsRosterRequest.json();

    let leafsRoster = leafsRosterResponse["roster"];
    if (position == "def") {
      for (let i = 0; i < leafsRoster.length; i++) {
        if (leafsRoster[i]["position"]["abbreviation"] != "D") {
          delete leafsRoster[i];
        }
      }
    } else if (position == "tend") {
      for (let i = 0; i < leafsRoster.length; i++) {
        if (leafsRoster[i]["position"]["abbreviation"] != "G") {
          delete leafsRoster[i];
        }
      }
    }

    for (let i = 0; i < leafsRoster.length; i++) {
      if (leafsRoster[i] != undefined) {
        let playerLink = leafsRoster[i]["person"]["link"];
        let playerName = leafsRoster[i]["person"]["fullName"];
        console.log(leafsRoster);

        let playerStatsRequest = await fetch(
          "https://statsapi.web.nhl.com/" +
            playerLink +
            "/stats?stats=statsSingleSeasonPlayoffs&season=20192020"
        );
        let playerStatsResponse = await playerStatsRequest.json();

        console.log(playerStatsResponse);

        try {
          playerStats = playerStatsResponse["stats"][0]["splits"][0]["stat"];
        } catch (error) {
          playerStats = -1;
        } finally {
          if (playerStats != -1) {
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
            } else {
              let wins = playerStats["wins"];
              let g = new Goalie(playerName, wins);
              playerArray.push(g);
            }
          }
        }
      }
    }
    console.log(playerArray);
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

    if (position == "tend") {
      for (let i = 1; i < 7; i++) {
        document.getElementById(i).innerHTML = "";
      }
      if (topPlayers.length == 1) {
        let name = topPlayers[0]["playerName"];
        let total = topPlayers[0][stat];
        document.getElementById(1).innerHTML =
          name.toUpperCase() + ": " + total;
      } else {
        for (let i = 1; i < 5; i++) {
          let name = topPlayers[i - 1]["playerName"];
          let total = topPlayers[i - 1][stat];
          document.getElementById(i).innerHTML =
            name.toUpperCase() + ": " + total;
        }
      }
    } else {
      for (let i = 1; i < 7; i++) {
        let name = topPlayers[i - 1]["playerName"];
        let total = topPlayers[i - 1][stat];
        document.getElementById(i).innerHTML =
          name.toUpperCase() + ": " + total;
      }
    }
  }

  async function getStandings(filter) {
    var allPositions = document.getElementsByClassName("standings-position");
    var allLogos = document.getElementsByClassName("standings-logo");
    var allPoints = document.getElementsByClassName("standings-points");
    var container = document.getElementById("standings-container");
    while (allPositions[0]) {
      allPositions[0].parentNode.removeChild(allPositions[0]);
      allLogos[0].parentNode.removeChild(allLogos[0]);
      allPoints[0].parentNode.removeChild(allPoints[0]);
    }
    if (filter == "division") {
      const divisionStandingsRequest = await fetch(
        "https://statsapi.web.nhl.com/api/v1/standings"
      );
      let divisionStandingsResponse = await divisionStandingsRequest.json();
      let divisionStandingsArray =
        divisionStandingsResponse["records"][1]["teamRecords"];
      var container = document.getElementById("standings-container");
      for (let i = 0; i < divisionStandingsArray.length; i++) {
        var teamLogo = document.createElement("img");
        teamLogo.className = "standings-logo";
        let teamName = divisionStandingsArray[i]["team"]["name"];
        teamLogo.src = "images/teams/" + teamName + ".png";
        var teamPoints = document.createElement("div");
        teamPoints.className = "standings-points";
        teamPoints.innerHTML =
          "- " + divisionStandingsArray[i]["points"] + " PTS";

        var teamPosition = document.createElement("div");
        teamPosition.className = "standings-position";
        let position = (i + 1).toString();
        teamPosition.innerHTML = position + ". ";
        container.appendChild(teamPosition);
        container.appendChild(teamLogo);
        container.appendChild(teamPoints);
      }
    } else if (filter == "conf") {
      const confStandingsRequest = await fetch(
        "https://statsapi.web.nhl.com/api/v1/standings/byConference"
      );
      let confStandingsResponse = await confStandingsRequest.json();
      let confStandingsArray =
        confStandingsResponse["records"][0]["teamRecords"];
      var container = document.getElementById("standings-container");
      for (let i = 0; i < confStandingsArray.length; i++) {
        var teamLogo = document.createElement("img");
        teamLogo.className = "standings-logo";
        let teamName = confStandingsArray[i]["team"]["name"];
        teamLogo.src = "images/teams/" + teamName + ".png";
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
    } else if (filter == "league") {
      const leagueStandingsRequest = await fetch(
        "https://statsapi.web.nhl.com/api/v1/standings/byLeague"
      );
      let leagueStandingsResponse = await leagueStandingsRequest.json();
      let leagueStandingsArray =
        leagueStandingsResponse["records"][0]["teamRecords"];
      var container = document.getElementById("standings-container");
      for (let i = 0; i < leagueStandingsArray.length; i++) {
        var teamLogo = document.createElement("img");
        teamLogo.className = "standings-logo";
        let teamName = leagueStandingsArray[i]["team"]["name"];
        teamLogo.src = "images/teams/" + teamName + ".png";
        var teamPoints = document.createElement("div");
        teamPoints.className = "standings-points";
        teamPoints.innerHTML =
          "- " + leagueStandingsArray[i]["points"] + " PTS";

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

  document.getElementById("dropdown-button").onclick = function () {
    document.getElementById("dropdown-content").style.display = "block";
  };

  document.getElementById("standings-dropdown-button").onclick = function () {
    document.getElementById("standings-dropdown-content").style.display =
      "block";
  };

  window.onclick = function (event) {
    if (!event.target.matches(".dropdown-button")) {
      document.getElementById("dropdown-content").style.display = "none";
    }
    if (!event.target.matches("#standings-dropdown-button")) {
      document.getElementById("standings-dropdown-content").style.display =
        "none";
    }
  };

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
    document.getElementById("standings-dropdown-button").innerHTML =
      "DIVISION &#9660";
  };

  let conf = document.getElementById("conference");
  conf.onclick = function () {
    getStandings("conf");
    document.getElementById("standings-dropdown-button").innerHTML =
      "CONFERENCE &#9660";
  };

  let league = document.getElementById("league");
  league.onclick = function () {
    getStandings("league");
    document.getElementById("standings-dropdown-button").innerHTML =
      "LEAGUE &#9660";
  };

  //getTopScorers("points");
  setInterval(doDate, 1000);
  //getLastGame();
  //getNextGame();
  getStandings("division");
});
