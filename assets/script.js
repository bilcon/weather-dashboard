
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
          city = "Seattle";
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

    $("#submit").on("click", (e) => {
        e.preventDefault();
        getCity();
        search();
        $("#city-input").val("");
        listCities();
    });

    function getCity() {
        city = $("#city-input").val();
        if (city && cities.includes(city) === false) {
          saveToLocalStorage();
          return city;
        } else if (!city) {
          alert("Please enter a valid city");
        }
    }
    
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

    $("#clr-btn").click(() => {
        localStorage.removeItem("cities");
        loadRecentCities();
        listCities();
    });
});
