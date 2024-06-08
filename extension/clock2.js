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

    let scheduleData = [];
    let statsData = [];

    // async function getTopScorers(stat, position)
    async function getStatsAndSchedule() {
        const response = await fetch("http://localhost:8080/api/nhl-schedule");
        const data = await response.json();
        scheduleData = data["games"];
        statsData = data["playerStats"];
    }

    async function setStats() {
        let players = []
        for (i in statsData) {
            let p = new Player(
                statsData[i].skaterFullName,
                82,
                statsData[i].goals,
                statsData[i].assists,
                statsData[i].points
            )
            players.push(p)
        }

        for (let i = 1; i < 7; i++) {
            let name = players[i - 1]["playerName"];
            let points = players[i - 1]["points"];
            document.getElementById(i).innerHTML = name.toUpperCase() + ": " + points;
        }
    }

    // Perform all the functions on window load to show the desired screen
    setInterval(doDate, 1000);
    // getNextGame();
    getStatsAndSchedule().then(setStats)
});