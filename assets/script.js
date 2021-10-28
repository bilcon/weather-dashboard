
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

    $("#clr-btn").click(() => {
        localStorage.removeItem("cities");
        loadRecentCities();
        listCities();
    });
});
