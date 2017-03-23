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

$(document).ready(function() {
    console.log('Document ready.');

    // global list of building markers
    var markers = [
        ['Bahen Center', 43.659643, -79.397668],
        ['Galbraith Building', 43.660131, -79.395993],
        ['McLennan Physical Laboratories', 43.660879, -79.398444]
    ];

    // generate building list cards and marker list
    getBuildings();

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
            bounds.extend(position);
            marker = new google.maps.Marker({
                position: position,
                map: map,
                title: markers[i][0]
            });

            // Automatically center the map fitting all markers on the screen
            map.fitBounds(bounds);
        }

        // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
        var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
            this.setZoom(16);
            google.maps.event.removeListener(boundsListener);
        });
    }

    /* Ajax call to get buildings */
    function getBuildings() {
        $.ajax({
            url: '/api/v1/building/get_all_buildings',
            method: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(data) {
                var buildings = data;
                if (!buildings.length) {
                    console.log('No buildings found.');
                    return;
                }

                var txt = "";
                var name, address;
                for (var i = 0; i < buildings.length; i++) {
                	// store name, slice address to keep only number and street name
                    name = buildings[i].name;
                    address = buildings[i].address.slice(0, buildings[i].address.indexOf(','));

                    // create list-group-item with building info
                    txt += '<a class="list-group-item" href="' + name + '-info.html">' 
                    	+ '<div class="row"><div class="col-sm-9">' 
                    	+ '<h4 class="card-heading list-group-item-heading">' + name + '</h4>' 
                    	+ '<p class="list-group-item-text">' + address + '</p></div>'
                    	+ '<div class="card-icon col-sm-3">' 
                    	+ '<i class="fa fa-angle-down fa-3x pull-right" aria-hidden="true"></i></div></div></a>'
                    
                    // create marker for this building and push to list
                    markers.push([buildings[i].name, buildings[i].lat, buildings[i].lon]);
                }

                // append building list cards to list-group
                $("#list-group").append(txt).removeClass("hidden");
            }
        });
    }

    // create map with building markers
    initMap();
});
