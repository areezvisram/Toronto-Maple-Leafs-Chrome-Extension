window.addEventListener("load", function () {
  function doDate() {
    var now = new Date();

    document.getElementById("hours").innerHTML = now.getHours();
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

//   async function getNextGame() {
//     const nextGameRequest = await fetch("https://statsapi.web.nhl.com/api/v1/teams/10?expand=team.schedule.next");
//     let nextGameResponse = await nextGameRequest.json();
//     let nextGameDate = nextGameResponse['teams'][0]['nextGameSchedule']['dates'][0]['date'];
//     document.getElementById("next-game-date").innerHTML = "DATE: " + nextGameDate;
//     console.log(nextGameResponse);
//     let nextGameAway = nextGameResponse['teams'][0]['nextGameSchedule']['dates'][0]['games'][0]['teams']['away']['team']['name'];
//   }

  setInterval(doDate, 1000);
//   getNextGame();
});
