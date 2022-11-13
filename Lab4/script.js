//function to wait for html page to load
window.onload = function () {
  const list = document.querySelector(".ajax-section .days");

  //for cleaning the screen for new location
  const clearScreen = () => {
    list.innerHTML = "";
    document.getElementById("showRegion").innerHTML = "";
    document.getElementById("showTemp").innerHTML = "";
    document.getElementById("main-icon").src = "";
    document.getElementById("day-hour").innerHTML = "";
    document.getElementById("precip").innerHTML = "";
    document.getElementById("humidity").innerHTML = "";
    document.getElementById("wind").innerHTML = "";
    document.getElementById("comment").innerHTML = "";
    document.getElementById("loading").innerHTML = "";
    document.getElementById("error-msg").innerHTML = "";
  };

  //function to fatch data from weater api
  const weatherAPI = (locaction) => {
    clearScreen();
    document.getElementById("loading").innerHTML = "Loading......";

    $.ajax({
      type: "GET",
      url: "https://weatherdbi.herokuapp.com/data/weather/" + locaction,
      dataType: "json",
      success: (json) => {
        if (json.status === "fail") {
          document.getElementById("loading").innerHTML = "";
          document.getElementById("error-msg").innerHTML = "Location not found";
          return;
        }
        document.getElementById("loading").innerHTML = "";
        document.getElementById("showRegion").innerHTML = json.region;
        document.getElementById("showTemp").innerHTML =
          json.currentConditions.temp.c + " °C";
        document.getElementById("main-icon").src =
          json.currentConditions.iconURL;
        document.getElementById("day-hour").innerHTML =
          json.currentConditions.dayhour;
        document.getElementById("precip").innerHTML =
          "precipitation: " + json.currentConditions.precip;
        document.getElementById("humidity").innerHTML =
          "humidity: " + json.currentConditions.humidity;
        document.getElementById("wind").innerHTML =
          "Wind: " + json.currentConditions.wind.km + "/h";
        document.getElementById("comment").innerHTML =
          json.currentConditions.comment;
        for (let i = 1; i < 8; i++) {
          const markup = `
                        <h2>${json.next_days[i].day}</h2>
                        <div class="city-temp">${json.next_days[i].max_temp.c}<sup>°C</sup></div>
                        <h4>Min Temp: ${json.next_days[i].min_temp.c}<sup>°C</sup></h4>
                        <figure>
                            <img class="city-icon" src="${json.next_days[i].iconURL}">
                            <figcaption>${json.next_days[i]["comment"]}</figcaption>
                        </figure>
                    `;
          const li = document.createElement("li");
          li.classList.add("city");
          li.innerHTML = markup;
          list.appendChild(li);
        }
      },
      error: ()=>{
          document.getElementById("loading").innerHTML = "";
          document.getElementById("error-msg").innerHTML = "Error occured while calling api";
      }
    });
  };

  //onClick Action to get inserted location and calling weater function
  document.getElementById("getLoc").addEventListener("click", () => {
    const loc = document.getElementById("cityInp").value;
    weatherAPI(loc);
  });
  //onClick Action to get current location and calling weater function
  document.getElementById("currentLoc").addEventListener("click", () => {
    if (navigator.geolocation) {
      const currentloc = navigator.geolocation.getCurrentPosition((pos) => {
        const loc1 = pos.coords.latitude.toFixed(3) + "," + pos.coords.longitude.toFixed(3);
        weatherAPI(loc1);
      });
    } else {
      clearScreen();
      document.getElementById("Current location not available");
    }
  });
};
