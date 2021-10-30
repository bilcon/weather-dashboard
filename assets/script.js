
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
      $("#temp").text("Current Temp (F): " + cityTemp.toFixed(1));
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
        $("#high").text("Expected high (F): " + " " + cityHigh);    

      });

     
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
