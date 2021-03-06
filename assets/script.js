
$(document).ready(function () {

    var NowMoment = moment().format("l");
  
    //adds days to moment for forecast
    var day1 = moment().add(1, "days").format("l");
    var day2 = moment().add(2, "days").format("l");
    var day3 = moment().add(3, "days").format("l");
    var day4 = moment().add(4, "days").format("l");
    var day5 = moment().add(5, "days").format("l");
  
    //global variables
    var city;
    var cities;

    //function to load most recently searched city from local storage
    function loadMostRecent() {
        var lastSearch = localStorage.getItem("mostRecent");
        if (lastSearch) {
          city = lastSearch;
          search();
        } else {
          city = "Kansas City";
          search();
        }
      }
    
    loadMostRecent()
    
    //function to load recently searched cities from local storage
    function loadRecentCities() {
        var recentCities = JSON.parse(localStorage.getItem("cities"));
    
        if (recentCities) {
          cities = recentCities;
        } else {
          cities = [];
        }
    }
    
    loadRecentCities()

    //event handler for search city button
    $("#submit").on("click", (e) => {
        e.preventDefault();
        getCity();
        search();
        $("#city-input").val("");
        listCities();
    });

    //function to save searched cities to local storage
    function saveToLocalStorage() {
        localStorage.setItem("mostRecent", city);
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
    }

    //function to retrieve user inputted city name
    function getCity() {
        city = $("#city-input").val();
        if (city && cities.includes(city) === false) {
          saveToLocalStorage();
          return city;
        } else if (!city) {
          alert("Please enter a valid city");
        }
    }

    function search() {

    var apiKey = "ff1fa4a811532cc7c5c027aa0e72f480";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=ff1fa4a811532cc7c5c027aa0e72f480";
    var coords = [];

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {

      coords.push(response.coord.lat);
      coords.push(response.coord.lon);
      var cityName = response.name;
      var cityCond = response.weather[0].description.toUpperCase();
      var cityTemp = response.main.temp;
      var cityHum = response.main.humidity;
      var cityWind = response.wind.speed;
      var icon = response.weather[0].icon;
      $("#icon").html(
        `<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`
      );
      $("#city-name").html(cityName + " " + "(" + NowMoment + ")");
      $("#city-cond").text("Current Conditions: " + cityCond);
      $("#temp").text("Current Temp :  " + cityTemp.toFixed(1) + " ??F");
      $("#humidity").text("Humidity: " + cityHum + "%");
      $("#wind-speed").text("Wind Speed: " + cityWind + "mph");
      $("#date1").text(day1);
      $("#date2").text(day2);
      $("#date3").text(day3);
      $("#date4").text(day4);
      $("#date5").text(day5);

      getUV(response.coord.lat, response.coord.lon);
    }).fail(function (){
      alert("Could not get data")
    });

    //Function to get 5-day forecast and UV index and put them on page
    function getUV(lat, lon) {

      $.ajax({
        url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly" + "&units=imperial&appid=ff1fa4a811532cc7c5c027aa0e72f480",
        method: "GET",
      }).then(function (response) {

        //code to determine UV index severity
        var uvIndex = response.current.uvi;
        $("#uv-index").text("UV Index:" + " " + uvIndex);
        if (uvIndex >= 8) {
          $("#uv-index").css("color", "red");
        } else if (uvIndex > 4 && uvIndex < 8) {
          $("#uv-index").css("color", "yellow");
        } else {
          $("#uv-index").css("color", "green");
        }
        var cityHigh = response.daily[0].temp.max;
        $("#high").text("Expected high :  " + " " + cityHigh + " ??F");
        
        //forecast temp variables
        var day1temp = response.daily[1].temp.max;
        var day2temp = response.daily[2].temp.max;
        var day3temp = response.daily[3].temp.max;
        var day4temp = response.daily[4].temp.max;
        var day5temp = response.daily[5].temp.max;
        //forecast humidity variables
        var day1hum = response.daily[1].humidity;
        var day2hum = response.daily[2].humidity;
        var day3hum = response.daily[3].humidity;
        var day4hum = response.daily[4].humidity;
        var day5hum = response.daily[5].humidity;
        //forecast weather icon variables
        var icon1 = response.daily[1].weather[0].icon;
        var icon2 = response.daily[2].weather[0].icon;
        var icon3 = response.daily[3].weather[0].icon;
        var icon4 = response.daily[4].weather[0].icon;
        var icon5 = response.daily[5].weather[0].icon;
        
        $("#temp1").text("Temp(F):" + " " + day1temp.toFixed(1) + " ??F");
        $("#temp2").text("Temp(F):" + " " + day2temp.toFixed(1) + " ??F");
        $("#temp3").text("Temp(F):" + " " + day3temp.toFixed(1) + " ??F");
        $("#temp4").text("Temp(F):" + " " + day4temp.toFixed(1) + " ??F");
        $("#temp5").text("Temp(F):" + " " + day5temp.toFixed(1) + " ??F");

        $("#hum1").text("Hum:" + " " + day1hum + "%");
        $("#hum2").text("Hum:" + " " + day2hum + "%");
        $("#hum3").text("Hum:" + " " + day3hum + "%");
        $("#hum4").text("Hum:" + " " + day4hum + "%");
        $("#hum5").text("Hum:" + " " + day5hum + "%");

        $("#icon1").html(
          `<img src="http://openweathermap.org/img/wn/${icon1}@2x.png">`
        );
        $("#icon2").html(
          `<img src="http://openweathermap.org/img/wn/${icon2}@2x.png">`
        );
        $("#icon3").html(
          `<img src="http://openweathermap.org/img/wn/${icon3}@2x.png">`
        );
        $("#icon4").html(
          `<img src="http://openweathermap.org/img/wn/${icon4}@2x.png">`
        );
        $("#icon5").html(
          `<img src="http://openweathermap.org/img/wn/${icon5}@2x.png">`
        );
      });
    }
  }
  
    //function to render recently searched cities to page
    function listCities() {
        $("#cityList").text("");
        cities.forEach((city) => {
          $("#cityList").prepend("<tr><td>" + city + "</td></tr>");
        });
    }
    
    listCities();

    //event handler for recently searched cities in table
    $(document).on("click", "td", (e) => {
        e.preventDefault();
        var listedCity = $(e.target).text();
        city = listedCity;
        search();
    });

    //event handler for clear button
    $("#clr-btn").click(() => {
        localStorage.removeItem("cities");
        loadRecentCities();
        listCities();
    });
});
