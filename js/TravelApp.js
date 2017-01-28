$(document).ready(function() {

    $("#destinationForm").validate();

    var recentSearch=["NC/Charlotte"];
    var numSearches= recentSearch.length;
    console.log(numSearches);
    var lat = "";
    var lng = "";
    var dispLoc ="";

    var config = {
        apiKey: "AIzaSyD9YRQ4P9CkQtibtMvre_-4KV3kWrre_50",
        authDomain: "groupproject1-7be69.firebaseapp.com",
        databaseURL: "https://groupproject1-7be69.firebaseio.com",
        storageBucket: "groupproject1-7be69.appspot.com",
        messagingSenderId: "753382490540"
    };
    firebase.initializeApp(config);

    var database = firebase.database();


    function codeAddress(destination) {
        geocoder = new google.maps.Geocoder();
        // var place = $("#text").val();

        geocoder.geocode( { 'address': destination}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {

                var lat = results[0].geometry.location.lat();
                var lng = results[0].geometry.location.lng();
                dispLoc = results[0].formatted_address;
                console.log(dispLoc);

                initMap(lat,lng);
                callWeather(lat,lng);
                flickr(lat,lng,dispLoc);

                // alert("Latitude: "+results[0].geometry.location.lat());
                // alert("Longitude: "+results[0].geometry.location.lng());
                console.log("lat: "+lat+" lng: "+ lng);
            console.log(results);
            } 

            else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });//geocode request call
    }//codeAddress function

    function initMap(latitude, longitude) {
        var uluru = {lat: latitude, lng: longitude};
        console.log("initMap-uluru: "+ uluru);
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
      }//initMap function



    function callWeather(lat,lng){

        // var numSearches= recentSearch.length;
        // console.log(numSearches);
        // var currentDestination = recentSearch[numSearches-1];
        // console.log(currentDestination);
        var currentDestination = lat+","+lng;
        console.log("callweather lat/lng: " + currentDestination);

      $.ajax({
        url : "http://api.wunderground.com/api/45bc54e120183165/forecast/geolookup/conditions/almanac/astronomy/q/"+currentDestination +".json",
        dataType : "jsonp",

      success : function(parsed_json) {
        var location = $('<p>').text(dispLoc);
        var locationFull = $('<p>').text(parsed_json['current_observation']['display_location']["full"]);
        var temp_f = $('<p>').text(parsed_json['current_observation']['temp_f']);
        var temperature_string = $('<p>').text(parsed_json['current_observation']['temperature_string']);
        var weather = $('<p>').text(parsed_json['current_observation']['weather']);
        var rel_humid = $('<p>').text(parsed_json['current_observation']['relative_humidity']);
        
        var icon_current = $('<img>').attr('src', parsed_json['current_observation']['icon_url']);
        var icon_current2 = $('<img>').attr('src', parsed_json.current_observation.icon_url);
        
        var forecast_url = $("<a>").attr('href', parsed_json['current_observation']['forecast_url']);
        forecast_url.attr("title", "wunderground.com");
        forecast_url.attr("target","_blank")
        forecast_url.text("Click here for full forecast");
        forecast_url.addClass("link");

        var futureForecast_icon1 = $('<img>').attr('src', parsed_json.forecast.simpleforecast.forecastday[1].icon_url); 



        console.log(parsed_json);
        console.log("Current temperature in " + location + " is: " + temp_f);

        //Just displaying our options...there's more
        $("#weatherDispl").html(location);
        $("#weatherDispl").append(locationFull);
        $("#weatherDispl").append(temp_f);
        $("#weatherDispl").append(temperature_string);
        $("#weatherDispl").append(weather);
        $("#weatherDispl").append(rel_humid);
        $("#weatherDispl").append(icon_current);
        $("#weatherDispl").append(icon_current2);
        $("#weatherDispl").append(forecast_url);
        $("#weatherDispl").append(futureForecast_icon1);

      }

      });
    }



    // This function handles addition of new destinations
    $('#submit-location').on('click', function(){
        // Since this has type=submit,we have this line so that users can hit "enter" instead of clicking on the button and it won't move to the next page
        event.preventDefault();

        // This line of code will grab the input from the textbox
        var destination= $("#location-input").val().trim();
        console.log(destination);
        $('#location-input').val(" ");

        //add destination to firebase
        database.ref('searches/').push({
            Location: destination
        });


        // The destination from the input form is then added to our array
        recentSearch.push(destination);
        console.log(recentSearch);
        $("#picturesView").empty();
        $("#weatherDispl").empty();
        
        // Our fxn then runs which handles the processing of the recentSearch array
        codeAddress(destination);

        // not sure this is doing anything here
        return false;
    })

    //child added to database under searches appends button
    //of location added
    database.ref('searches').on('child_added', function(snapshot){
        var value = snapshot.val().Location;
        var button = $("<button>");
        button.text(value);
        button.attr('id', 'recent');

        $("#recent-searches").append(button);
    });

    // on recent searches button click
    $(document).on('click', '#recent', function(){
        var destination = $(this).text();
        codeAddress(destination);
    });


});