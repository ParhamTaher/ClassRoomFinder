/*
 * Most of this code was adapted from:
 * https://wrightshq.com/playground/placing-multiple-markers-on-a-google-map-using-api-3/
 *
 * Building list for testing purposes:
 *      var markers = [
            ['Bahen Center', 43.659643, -79.397668],
            ['Galbraith Building', 43.660131, -79.395993],
            ['McLennan Physical Laboratories', 43.660879, -79.398444]
        ];
 */
 // global list of building markers

var markers = [];

function initMap() {
    var map;
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        mapTypeId: 'roadmap'
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    map.setTilt(45);

    // place each marker on the map
    var marker, i;
    for (i = 0; i < markers.length; i++) {
        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        //bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i][0]
        });

        // Automatically center the map fitting all markers on the screen
        var position = new google.maps.LatLng(43.662905, -79.395661);
        bounds.extend(position)
        map.fitBounds(bounds);
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(15);
        google.maps.event.removeListener(boundsListener);
    });
}

 /* Ajax call to get buildings */
function getBuildings(route_url) {
    new_markers = [];
    $.ajax({
        type: 'GET',
        url: route_url,
        success: function(data) {
            // data is  JSON of all building List
            if (data.response.length <= 0) {
              console.log('No buildings found.');
              return;
            }

            console.log("Success", data);

            var txt = "";
            var id, name, address;
            for (var i = 0; i < data.response.length; i++) {
                // store name, slice address to keep only number and street name
                id = data.response[i].building_id;
                name = data.response[i].name;
                address = data.response[i].address.slice(0, data.response[i].address.indexOf(','));

                // create list-group-item with building info
                txt += '<a class="list-group-item" name="' + name + '">'
                    + '<div class="row">'
                    + '<div class="col-sm-9">'
                    + '<h4 class="card-heading list-group-item-heading">' + name + '</h4>'
                    + '<p class="list-group-item-text">' + address + '</p>'
                    + '</div>'
                    + '<div class="card-icon col-sm-3">'
                    + '<i class="fa fa-angle-down fa-3x pull-right" aria-hidden="true"></i>'
                    + '</div>'
                    + '</div>'
                    + '<div class="panel-footer">'
                    + '<div class="btn-group btn-group-justified">'
                    + '<div class="btn-group">'
                    + '<button class="btn btn-default rooms-sub-nav">'
                    + '<i class=""></i> Rooms'
                    + '</button>'
                    + '</div>'
                    + '<div class="btn btn-default labs-sub-nav">'
                    + '<i class=""></i> Labs'
                    + '</button>'
                    + '</div>'
                    + '<div class="btn-group">'
                    + '<button class="btn btn-default lecture-sub-nav">'
                    + '<i class=""></i> Lecture Halls'
                    + '</button>'
                    + '</div>'
                    + '</div>'
                    + '<br />'
                    + '<button id="' + id + '" type="button" class="btn btn-lg btn-block btn-warning">Add Favourites</button>'
                    + '</div>'
                    + '</a>'

                console.log("lat", data.response[i].lat)
;                new_markers.push([data.response[i].name, data.response[i].lat, data.response[i].lon]);
                //console.log(markers);
            }
            markers = new_markers;
            $("#list-group").html(txt).removeClass("hidden");
            $(".panel-footer").hide();

            var buildingName = "";
            // on card click, show card's panel footer
            $('.list-group-item').click(function(){
                buildingName = $(this).attr("name");
                $(".panel-footer").not($(this).children(".panel-footer")).each(function() {
                    $(this).slideUp(300);
                });
                $(this).children(".panel-footer").slideToggle(300);
            });

            $('.rooms-sub-nav').click(function() {
                $('#building_rooms').removeClass("hidden");
                $('#map-canvas').addClass("hidden");
                $(".buildingName").html(buildingName + " -> Rooms");
            });

            $('.labs-sub-nav').click(function() {
              $('#building_rooms').removeClass("hidden");
              $('#map-canvas').addClass("hidden");
              $(".buildingName").html(buildingName + " -> Labs");
            });

            $('.lecture-sub-nav').click(function() {
              $('#building_rooms').removeClass("hidden");
              $('#map-canvas').addClass("hidden");
              $(".buildingName").html(buildingName + " -> Lecture Halls");
            });
        }
    });
}

function loadNearbyMap(lat, lon) {
    $('#map-canvas').fadeOut(300).empty();

    getBuildings('/api/v1/building/get_nearby_buildings/?lat=' + parseInt(lat) + '&' + 'lon=' + parseInt(lon));
    initMap();
    $('#list-group').fadeIn(300);
    $('#map-canvas').fadeIn(300);
}

 function loadFavouritesMap() {
   $('#map-canvas').fadeOut(300).empty();
   //$('#list-group').fadeOut(300).empty();
   markers = [
       ['Bahen Center', 43.659643, -79.397668]
   ];
   //getBuildings('/api/v1/user/get_favourite_buildings');
   initMap();
   $('#list-group').fadeIn(300);
   $('#map-canvas').fadeIn(300);
   $(".panel-footer").hide();
 }

function loadAllMap() {
    $('#map-canvas').fadeOut(300).empty();

    getBuildings('/api/v1/building/get_all_buildings');
    initMap();
    $('#list-group').fadeIn(300);
    $('#map-canvas').fadeIn(300);
}

// https://zeit.co/blog/async-and-await
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Geolocation Code referenced from: https://www.w3schools.com/html/html5_geolocation.asp
var user_location_lat = 0;
var user_location_lon = 0;
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
function showPosition(position) {
    user_location_lat = position.coords.latitude;
    user_location_lon = position.coords.longitude;
}
//

$(document).ready(function() {
    console.log('Document ready.');

    $('#map-canvas').fadeOut(300);
    $('#list-group').fadeOut(300);

    //Load by default
    loadAllMap();
    console.log("Loaded!");
    // nearby clicked, reload building list and map
    $('#nearby').click(function() {
        console.log("Nearby!");
        getLocation();
        sleep(4000).then(() => {
            console.log(user_location_lat, user_location_lon);
            loadNearbyMap(user_location_lat, user_location_lon);
        });

    });

    // favourites clicked, reload building list and map
    $('#favourites').click(function() {
        console.log("Favourites!");
    });

    // all clicked, reload building list and map
    $('#all').click(function() {
        $('#building_rooms').addClass("hidden");
        $('#room_info').addClass("hidden");
        $('#comments_section').addClass("hidden");
        $('#map-canvas').removeClass("hidden");

        loadAllMap();
    });


});
