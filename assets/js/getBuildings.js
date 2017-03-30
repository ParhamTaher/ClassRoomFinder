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
function getBuildings(url) {
    $.ajax({
        type: 'GET',
        url: url,
        success: function(data) {
            // clear old building data
            markers.clear();

            // check to see if data is empty
            if (!data.response.length) {
                console.log('No buildings found.');
                return;
            }

            console.log("Success: buildings found.");

            var txt = "";
            var id, name, address;
            for (var i = 0; i < data.response.length; i++) {
                // store name, slice address to keep only number and street name
                id = data.response[i].building_id;
                name = data.response[i].name;
                address = data.response[i].address.slice(
                    0, data.response[i].address.indexOf(','));

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
                    + '</a>';

                // push building to markers list
                markers.push([data.response[i].name, data.response[i].lat, data.response[i].lon]);
            }

            $("#list-group").html(txt).removeClass("hidden");
            $(".panel-footer").hide();
        }
    });
}

// reload list and map with nearby buildings
function loadNearby(lat, lon) {
    $('#map-canvas').fadeOut(300).empty();
    getBuildings('/api/v1/building/get_nearby_buildings?lat=' + lat + '&' + 'lon=' + lon);
    initMap();
    $('#map-canvas').fadeIn(300);
    $(".panel-footer").hide();
}

// reload list and map with user's favourite buildings
function loadFavourites() {
    $('#map-canvas').fadeOut(300).empty();
    getBuildings('/api/v1/user/get_favourite_buildings');
    initMap();
    $('#map-canvas').fadeIn(300);
    $(".panel-footer").hide();
}

// reload list and map with all buildings
function loadAll() {
    $('#map-canvas').fadeOut(300).empty();
    getBuildings('/api/v1/building/get_all_buildings');
    initMap();
    $('#map-canvas').fadeIn(300);
    $(".panel-footer").hide();
}

// https://zeit.co/blog/async-and-await
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// get current location of user
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// save user's current location in variables
function showPosition(position) {
    user_lat = position.coords.latitude;
    user_lon = position.coords.longitude;
}

// on card click, show card's panel footer
$('.list-group-item').click(function() {
    $(".panel-footer").not($(this).children(".panel-footer")).each(function() {
        $(this).slideUp(300);
    });
    $(this).children(".panel-footer").slideToggle(300);
});

$(document).ready(function() {
    console.log("Document ready.");

    // homepage defaults to nearby buildings
    getLocation();
    loadNearby(user_lat, user_lon);

    // nearby buildings clicked, reload building list and map
    $('#nearby').click(function() {
        getLocation();
        loadNearby(user_lat, user_lon);
    });

    // favourite buildings clicked, reload building list and map
    $('#favourites').click(function() {
        loadFavourites();
    });

    // all buildings clicked, reload building list and map
    $('#all').click(function() {
        loadAll();
    });
});
