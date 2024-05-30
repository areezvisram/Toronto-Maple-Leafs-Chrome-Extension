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

    async function getNextGame() {

        // Request and JSON object
        const nextGameRequest = await fetch("http://localhost:8080/api/nhl-schedule");
        let nextGameResponse = await nextGameRequest.json();

        let games = nextGameResponse["games"];

        if (games.length == 0) {
            document.getElementById("next-game").style.display = "none";
            document.getElementById("season-over").style.display = "block";
        }
        // let nextGameExists = true;

        // // Making sure there is a next game (not end of season)
        // try {

        //     // Getting next game away team
        //     let nextGameDate = nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0]["date"];
        //     document.getElementById("next-game-date").innerHTML = "DATE: " + nextGameDate;
        //     let nextGameAway = nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0]["games"][0]["teams"]["away"]["team"]["name"];
        //     console.log(nextGameAway)
        //     if (nextGameAway.includes('Canadiens')) {
        //         nextGameAway = "Montreal Canadiens";
        //     }
        //     document.getElementById("next-game-away").innerHTML = nextGameAway.toUpperCase();

        //     // Geting next game away team record
        //     let nextGameAwayWins = nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0]["games"][0]["teams"]["away"]["leagueRecord"]["wins"];
        //     let nextGameAwayLosses = nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0]["games"][0]["teams"]["away"]["leagueRecord"]["losses"];
        //     let nextGameAwayOT = nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0]["games"][0]["teams"]["away"]["leagueRecord"]["ot"];
        //     let nextGameAwayRecord = nextGameAwayWins + "-" + nextGameAwayLosses + "-" + nextGameAwayOT;
        //     document.getElementById("next-game-away-record").innerHTML = nextGameAwayRecord;

        //     // Getting next game home team 
        //     let nextGameHome = nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0]["games"][0]["teams"]["home"]["team"]["name"];
        //     if (nextGameHome.includes('Canadiens')) {
        //         nextGameHome = "Montreal Canadiens";
        //     }
        //     document.getElementById("next-game-home").innerHTML = nextGameHome.toUpperCase();

        //     // Getting next game home team record
        //     let nextGameHomeWins = nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0]["games"][0]["teams"]["home"]["leagueRecord"]["wins"];
        //     let nextGameHomeLosses = nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0]["games"][0]["teams"]["home"]["leagueRecord"]["losses"];
        //     let nextGameHomeOT = nextGameResponse["teams"][0]["nextGameSchedule"]["dates"][0]["games"][0]["teams"]["home"]["leagueRecord"]["ot"];
        //     let nextGameHomeRecord = nextGameHomeWins + "-" + nextGameHomeLosses + "-" + nextGameHomeOT;
        //     document.getElementById("next-game-home-record").innerHTML = nextGameHomeRecord;

        //     // Getting next game away logo      
        //     let nextGameAwayLogoSrc = "images/teams/" + nextGameAway + ".png";
        //     document.getElementById("next-away-team-logo").src = nextGameAwayLogoSrc;

        //     // Getting next game home logo
        //     let nextGameHomeLogoSrc = "images/teams/" + nextGameHome + ".png";
        //     document.getElementById("next-home-team-logo").src = nextGameHomeLogoSrc;

        // } catch (error) {
        //     nextGameExists = false;
        // }

        // // If end of season, show that there is no next game
        // if (nextGameExists == false) {
        //     document.getElementById("next-game").style.display = "none";
        //     document.getElementById("season-over").style.display = "block";
        // }
    }

    // Perform all the functions on window load to show the desired screen
    setInterval(doDate, 1000);
    getNextGame();
});