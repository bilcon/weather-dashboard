
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
    

    $("#clr-btn").click(() => {
        localStorage.removeItem("cities");
        loadRecentCities();
        listCities();
    });
});
