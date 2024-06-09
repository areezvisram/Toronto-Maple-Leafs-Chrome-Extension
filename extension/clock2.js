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

    async function setStats(stat, def = false, goalie = false) {
        let players = [];
        const container = document.querySelector('.top-scorers-container');
        const currentScorers = container.querySelectorAll('.top-scorers');
        currentScorers.forEach(scorer => scorer.remove());
        for (i in statsData) {
            if (def && statsData[i].positionCode !== "D") {
                continue;
            }
            let p = new Player(
                statsData[i].skaterFullName,
                82,
                statsData[i].goals,
                statsData[i].assists,
                statsData[i].points
            )
            players.push(p)
        }

        players = players.sort((a, b) => b[stat] - a[stat]);

        players.forEach(player => {
            const scorerDiv = document.createElement('div');
            scorerDiv.className = 'top-scorers';
            scorerDiv.innerHTML = `${player.playerName.toUpperCase()}: ${player[stat]}`;
            container.appendChild(scorerDiv);
        });
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


    // Perform all the functions on window load to show the desired screen
    setInterval(doDate, 1000);
    // getNextGame();
    getStatsAndSchedule().then(() => {
        setStats("points");
    });
});