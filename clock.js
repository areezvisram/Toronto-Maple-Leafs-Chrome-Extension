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
      console.log(nextGameResponse);
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

  document.getElementById("dropdown-button").onclick = function () {
    document.getElementById("dropdown-content").style.display = "block";
  };

  let playerArray = [];
  async function getTopScorers() {
    const leafsRosterRequest = await fetch(
      "https://statsapi.web.nhl.com/api/v1/teams/10/roster"
    );
    let leafsRosterResponse = await leafsRosterRequest.json();

    let leafsRoster = leafsRosterResponse["roster"];
    for (let i = 0; i < leafsRoster.length; i++) {
      let playerLink = leafsRoster[i]["person"]["link"];
      let playerName = leafsRoster[i]["person"]["fullName"];

      let playerStatsRequest = await fetch(
        "https://statsapi.web.nhl.com/" +
          playerLink +
          "/stats?stats=statsSingleSeasonPlayoffs&season=20192020"
      );
      let playerStatsResponse = await playerStatsRequest.json();

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
            let p = new Player(playerName, gamesPlayed, goals, assists, points);
            playerArray.push(p);
          }
        }
      }
    }
    let top = [];
    let topUnsorted = [];
    for (let i = 0; i < playerArray.length; i++) {
      top.push(playerArray[i]["points"]);
      topUnsorted.push(playerArray[i]["points"]);
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
    for (let i = 1; i < 7; i++) {
      let name = topPlayers[i-1]["playerName"];
      let stat = topPlayers[i-1]["points"];
      document.getElementById(i).innerHTML = name.toUpperCase() + ": " + stat
    }
  }

  window.onclick = function (event) {
    if (!event.target.matches(".dropdown-button")) {
      document.getElementById("dropdown-content").style.display = "none";
    }
  };

  getTopScorers();
  setInterval(doDate, 1000);
  //getLastGame();
  //getNextGame();
});
