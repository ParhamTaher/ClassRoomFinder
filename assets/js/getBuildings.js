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

// user's current latitude and longitude
var user_lat, user_lon;

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
        bounds.extend(position)
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i][0]
        });
    }

    // Automatically center the map fitting all markers on the screen
    map.fitBounds(bounds);

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(16);
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
            markers = [];
            var buildings = data.response;

            // check to see if building list is empty
            if (!buildings.length) {
                console.log('No buildings found.');
                return;
            }

            console.log("Success: buildings found.");

            var txt = "";
            var id, name, address;
            for (var i = 0; i < buildings.length; i++) {
                // store name, slice address to keep only number and street name
                id = buildings[i].building_id;
                name = buildings[i].name.substring(0, buildings[i].name.lastIndexOf(" "));
                address = buildings[i].address.slice(0, buildings[i].address.indexOf(','));

                // create list-group-item with building info
                txt += '<a class="list-group-item" data-bid="' + id + '">'
                    + '<div class="row"><div class="col-xs-9">'
                    + '<h4 class="card-heading list-group-item-heading">' + name + '</h4>'
                    + '<p class="list-group-item-text">' + address + '</p></div>'
                    + '<div class="card-icon col-xs-3">'
                    + '<i class="fa fa-angle-down fa-3x pull-right rotate" aria-hidden="true"></i></div></div>'
                    + '<div class="panel-footer"><div class="btn-group btn-group-justified">'
                    + '<div class="btn-group"><button class="btn btn-default btn-rooms">'
                    + '<i class="fa fa-building"></i> Rooms </button></div><div class="btn-group">'
                    + '<button class="btn btn-default btn-comments"><i class="fa fa-comments"></i> Comments</button></div>'
                    + '<div class="btn-group"><button class="btn btn-info btn-fav">'
                    + '<i class="fa fa-star"></i> Favourite</button></div></div></div></a>';

                // push building to markers list
                markers.push([buildings[i].name, buildings[i].lat, buildings[i].lon]);
            }

            $("#list-group").html(txt).removeClass("hidden");
            initMap();
            $('#list-group').fadeIn(300);
            $('#map-canvas').fadeIn(300);
            $(".panel-footer").hide();
        }
    });
}

// reload list and map with nearby buildings
function loadNearby(lat, lon) {
    $('#map-canvas').fadeOut(300).empty();
    $('#list-group').fadeOut(300);
    getBuildings('/api/v1/building/get_nearby_buildings?lat=' + lat + '&' + 'lon=' + lon);
}

// reload list and map with user's favourite buildings
function loadFavourites() {
    $('#map-canvas').fadeOut(300).empty();
    $('#list-group').fadeOut(300);
    getBuildings('/api/v1/user/get_favourite_buildings');
}

// reload list and map with all buildings
function loadAll() {
    $('#map-canvas').fadeOut(300).empty();
    $('#list-group').fadeOut(300);
    getBuildings('/api/v1/building/get_all_buildings');
}

// https://zeit.co/blog/async-and-await
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

// get current location of user
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            showPosition(position);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// callback function for getCurrentPosition
function showPosition(position) {
    user_lat = position.coords.latitude;
    user_lon = position.coords.longitude;
    loadNearby(user_lat, user_lon);
}

$(document).ready(function() {
    console.log("Document ready.");

    // hide list and map before populating
    $('#map-canvas').fadeOut();
    $('#list-group').fadeOut();

    // homepage defaults to nearby buildings
    //loadFavourites();

    // nearby buildings clicked, reload building list and map
    $('#nearby').click(function() {
        getLocation();
    });

    // favourite buildings clicked, reload building list and map
    $('#favourites').click(function() {
        loadFavourites();
    });

    // all buildings clicked, reload building list and map
    $('#all').click(function() {
        loadAll();
    });

    // on card click, show card's panel footer
    $('#list-group').on('click', '.list-group-item', function() {
        $(".list-group-item").not($(this)).each(function() {
            $(this).find('.rotate').removeClass('up');
            $(this).children('.panel-footer').slideUp(300);
        });
        $(this).children(".panel-footer").slideToggle(300);
        $(this).find('.rotate').toggleClass('up');
    });
});
