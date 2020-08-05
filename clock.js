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

  setInterval(doDate, 1000);

});
