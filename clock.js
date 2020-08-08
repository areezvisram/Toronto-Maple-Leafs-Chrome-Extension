window.addEventListener("load", function () {
  function doDate() {
    var now = new Date();

    if(now.getHours().toString().length == 1) {
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
    const nextGameRequest = await fetch("https://statsapi.web.nhl.com/api/v1/teams/10?expand=team.schedule.next");
    let nextGameResponse = await nextGameRequest.json();
    let nextGameDate = nextGameResponse['teams'][0]['nextGameSchedule']['dates'][0]['date'];
    document.getElementById("next-game-date").innerHTML = "DATE: " + nextGameDate;
    console.log(nextGameResponse);
    let nextGameAway = nextGameResponse['teams'][0]['nextGameSchedule']['dates'][0]['games'][0]['teams']['away']['team']['name'];
    document.getElementById("next-game-away").innerHTML = nextGameAway.toUpperCase();
    let nextGameAwayWins = nextGameResponse['teams'][0]['nextGameSchedule']['dates'][0]['games'][0]['teams']['away']['leagueRecord']['wins'];
    let nextGameAwayLosses = nextGameResponse['teams'][0]['nextGameSchedule']['dates'][0]['games'][0]['teams']['away']['leagueRecord']['losses'];
    let nextGameAwayOT = nextGameResponse['teams'][0]['nextGameSchedule']['dates'][0]['games'][0]['teams']['away']['leagueRecord']['ot'];
    let nextGameAwayRecord = nextGameAwayWins + "-" + nextGameAwayLosses + "-" + nextGameAwayOT;
    document.getElementById("next-game-away-record").innerHTML = nextGameAwayRecord;

    let nextGameHome = nextGameResponse['teams'][0]['nextGameSchedule']['dates'][0]['games'][0]['teams']['home']['team']['name'];
    document.getElementById("next-game-home").innerHTML = nextGameHome.toUpperCase();
    let nextGameHomeWins = nextGameResponse['teams'][0]['nextGameSchedule']['dates'][0]['games'][0]['teams']['home']['leagueRecord']['wins'];
    let nextGameHomeLosses = nextGameResponse['teams'][0]['nextGameSchedule']['dates'][0]['games'][0]['teams']['home']['leagueRecord']['losses'];
    let nextGameHomeOT = nextGameResponse['teams'][0]['nextGameSchedule']['dates'][0]['games'][0]['teams']['home']['leagueRecord']['ot'];
    let nextGameHomeRecord = nextGameHomeWins + "-" + nextGameHomeLosses + "-" + nextGameHomeOT;
    document.getElementById("next-game-home-record").innerHTML = nextGameHomeRecord;

    let nextGameAwayLogoSrc = "images/teams/" +  nextGameAway + ".png";
    document.getElementById("next-away-team-logo").src = nextGameAwayLogoSrc;

    let nextGameHomeLogoSrc = "images/teams/" +  nextGameHome + ".png";
    document.getElementById("next-home-team-logo").src = nextGameHomeLogoSrc;
  }

  async function getLastGame() {
    const lastGameRequest = await fetch("https://statsapi.web.nhl.com/api/v1/teams/10?expand=team.schedule.previous");
    let lastGameResponse = await lastGameRequest.json();
    console.log(lastGameResponse);

    let lastGameDate = lastGameResponse["teams"][0]['previousGameSchedule']['dates'][0]['date'];
    document.getElementById("last-game-date").innerHTML = "DATE: " + lastGameDate;

    let lastGameAway = lastGameResponse["teams"][0]["previousGameSchedule"]['dates'][0]['games'][0]['teams']['away']['team']['name'];
    document.getElementById("last-game-away").innerHTML = lastGameAway;

    let lastGameAwayWins = lastGameResponse["teams"][0]["previousGameSchedule"]['dates'][0]['games'][0]['teams']['away']['leagueRecord']['wins'];
    let lastGameAwayLosses = lastGameResponse["teams"][0]["previousGameSchedule"]['dates'][0]['games'][0]['teams']['away']['leagueRecord']['losses'];
    let lastGameAwayOT = lastGameResponse["teams"][0]["previousGameSchedule"]['dates'][0]['games'][0]['teams']['away']['leagueRecord']['ot'];
    let lastGameAwayRecord = lastGameAwayWins + "-" + lastGameAwayLosses + '-' + lastGameAwayOT;
    document.getElementById("last-game-away-record").innerHTML = lastGameAwayRecord;

    let lastGameHomeWins = lastGameResponse["teams"][0]["previousGameSchedule"]['dates'][0]['games'][0]['teams']['home']['leagueRecord']['wins'];
    let lastGameHomeLosses = lastGameResponse["teams"][0]["previousGameSchedule"]['dates'][0]['games'][0]['teams']['home']['leagueRecord']['losses'];
    let lastGameHomeOT = lastGameResponse["teams"][0]["previousGameSchedule"]['dates'][0]['games'][0]['teams']['home']['leagueRecord']['ot'];
    let lastGameHomeRecord = lastGameHomeWins + "-" + lastGameHomeLosses + '-' + lastGameHomeOT;
    document.getElementById("last-game-home-record").innerHTML = lastGameHomeRecord;

    let lastGameHome = lastGameResponse["teams"][0]["previousGameSchedule"]['dates'][0]['games'][0]['teams']['home']['team']['name'];
    document.getElementById("last-game-home").innerHTML = lastGameHome;

    let lastGameAwayScore = lastGameResponse["teams"][0]["previousGameSchedule"]['dates'][0]['games'][0]['teams']['away']['score'];
    document.getElementById("last-game-away-score").innerHTML = lastGameAwayScore;

    let lastGameHomeScore = lastGameResponse["teams"][0]["previousGameSchedule"]['dates'][0]['games'][0]['teams']['home']['score'];
    document.getElementById("last-game-home-score").innerHTML = lastGameHomeScore;

    let lastGameAwayLogoSrc = "images/teams/" +  lastGameAway + ".png";
    document.getElementById("last-away-team-logo").src = lastGameAwayLogoSrc;

    let lastGameHomeLogoSrc = "images/teams/" +  lastGameHome + ".png";
    document.getElementById("last-home-team-logo").src = lastGameHomeLogoSrc;
  }



  setInterval(doDate, 1000);
  //getLastGame();
  //getNextGame();
});
