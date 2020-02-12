$(document).ready(function () {

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((location) => {
                var url = "https://api.openweathermap.org/data/2.5/weather?lat=" + location.coords.latitude + "&lon=" + location.coords.longitude + "&appid=166a433c57516f51dfab1f7edaed8413";
                searchCity(url);
            });
        }
    }

    getLocation();


    $("#search-btn").on('click', function (event) {
        event.preventDefault();
        $(".main-part").empty();
        $(".five-day-forecast").empty();
        var cityName = $("#input-box").val();

        var url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=166a433c57516f51dfab1f7edaed8413";
        var cityList = $("<li class='list-group-item city'>");
        cityList.text(cityName);
        $("#city-list").prepend(cityList);
        var caption = $("<h5>").html("5-Day Forecast: ");
        $(".five-day-forecast").append(caption);
        searchCity(url);

    })

    function searchCity(url) {

        $.ajax({
            url,
            method: "GET"
        }).then(function (response) {
            var dt = moment(response.dt, "X").format("MM/DD/YYYY");
            var img = $("<img>");
            img.attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
            var city = $("<h2>");
            city.append(response.name + " (" + dt + ")", img);
            var temp = ((response.main.temp - 273.15) * 1.80 + 32).toFixed(1);
            var temperature = $("<p>").html("temperature: " + temp + "F");
            var humidity = $("<p>").html("Humidity: " + response.main.humidity + "%");
            var wind = $("<p>").html("Wind Speed: " + response.wind.speed + " MPH");
            $(".main-part").append(city, temperature, humidity, wind);


            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=166a433c57516f51dfab1f7edaed8413",
                method: "GET"
            }).then(function (response2) {
                var uvIndex = $("<p class='text-danger'>").html("UV Index: " + response2.value);
                $(".main-part").append(uvIndex);


                $.ajax({
                    url: "https://api.openweathermap.org/data/2.5/forecast?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=166a433c57516f51dfab1f7edaed8413",
                    method: "GET"
                }).then(function (response3) {
                    var row = $("<div class='row'>");
                    for (let i = 0; i < response3.list.length; i++) {
                        if (response3.list[i].dt_txt.indexOf("00:00:00") > -1) {
                            var col = $("<div class='col-md-2'>");
                            var card = $("<div class='card bg-primary text-white'>");
                            var cardBody = $("<div class='card-body'>");
                            var p = $("<p>");
                            p.html(moment(response3.list[i].dt, "X").format("MM/DD/YYYY"));
                            var img = $("<img>");
                            img.attr("src", "http://openweathermap.org/img/w/" + response3.list[i].weather[0].icon + ".png");
                            var temp = ((response3.list[i].main.temp - 273.15) * 1.80 + 32).toFixed(1);
                            var temperature = $("<p>").html("Temp: " + temp);
                            var humi = $("<p>").html("Humidity: " + response3.list[i].main.humidity + "%");
                            cardBody.append(p, img, temperature, humi);
                            card.append(cardBody);
                            col.append(card);
                            row.append(col);
                        }
                    }
                    $(".five-day-forecast").append(row);
                })
            })
        })

    }

    $(document).on('click', ".city", function () {
        var city = $(this).text();
        var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=166a433c57516f51dfab1f7edaed8413";
        $(".main-part").empty();
        $(".five-day-forecast").empty();
        
        searchCity(url);
    })

});