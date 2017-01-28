// $(document).ready(function() {



    function flickr(lat,lng){

     
        console.log(" flickr called");
        // var lat = $("#latitude").val();
        console.log(lat);
        // var lon = $("#longitude").val();
        console.log(lng);

        var api_key = "b9480518c108f453a42aaf18fff9baae"


        // var queryURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=b9480518c108f453a42aaf18fff9baae&lat=" + lat + "&lon=" + lng + "&format=json&nojsoncallback=1";
        var queryURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=b9480518c108f453a42aaf18fff9baae&lat=" + lat + "&lon=" + lng + "&format=json&nojsoncallback=1";

        console.log(queryURL);


        $.ajax({
          url: queryURL,
          method: "GET"
        })
        // After the data comes back from the API
        .done(function(response) {
          // console.log results
            console.log(response);
            console.log(response.photos);
            console.log(response.photos.photo.length);
            console.log(response.photos.photo[0].farm);
            console.log(response.photos.photo[0].server);
            console.log(response.photos.photo[0].id)
            console.log(response.photos.photo[0].secret);

         for(var i = 0; i < 10; i++) {
            var farm = response.photos.photo[i].farm;
            var server = response.photos.photo[i].server;
            var secret = response.photos.photo[i].secret;
            var id = response.photos.photo[i].id;

            var photoSrc = "http://farm" + farm + ".staticflickr.com/" + server + "/" + id + "_" + secret +".jpg";
            // console.log(photoSrc);

            var photo = $('<img>').attr('src', photoSrc);
            photo.addClass('pictures');

            $("#picturesView").append(photo)
         }


        });
    }        
   
    // });