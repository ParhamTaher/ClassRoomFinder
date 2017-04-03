/*
 * Building list for testing purposes:
 *      var markers = [
            ['Bahen Center', 43.659643, -79.397668],
            ['Galbraith Building', 43.660131, -79.395993],
            ['McLennan Physical Laboratories', 43.660879, -79.398444]
        ];
 */

// global list of buildings in format [name, lat, lon]
var buildingList = [];

// list of markers on map
var markers = []

// user's current latitude and longitude
var user_lat, user_lon;

// current user and building ids for page
var userId, buildingId;

function initMap() {
    var map;
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        mapTypeId: 'roadmap'
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    map.setTilt(45);

    // place each marker on the map
    for (var i = 0; i < buildingList.length; i++) {
        var position = new google.maps.LatLng(buildingList[i][1], buildingList[i][2]);
        bounds.extend(position)
        var title = buildingList[i][0].substring(0, buildingList[i][0].lastIndexOf(" "));
        var label = buildingList[i][0].substring(buildingList[i][0].lastIndexOf(" ") + 1);
        //addMarker(map, position, title, label, i * 50);

        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: title,
            label: label
        });

        // add marker to markers list
        markers.push(marker);
    }

    // Automatically center the map fitting all markers on the screen
    map.fitBounds(bounds);

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(17);
        google.maps.event.removeListener(boundsListener);
    });
}

/*function addMarker(map, position, title, label, timeout) {
    window.setTimeout(function() {
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: title,
            label: label,
            animation: google.maps.Animation.DROP
        });

        // add marker to markers list
        markers.push(marker);
    }, timeout);
}*/

// add search bar above list if buildings were found
function addSearchBar() {
    var searchBar = '<div class="input-group input-group-lg">'
                    + '<span class="input-group-addon" id="addon">Building Name:</span>'
                    + '<input type="text" class="form-control" id="query" placeholder="Find a building...">'
                    + '</div>';

    $("#search").html(searchBar);
}

// add comments input form
function addCommentInput() {
    var commentForm = '<textarea id="comment-title" class="form-control" rows="1" placeholder="Enter title here (max 20 chars)..."></textarea><textarea id="comment-txt" class="form-control" rows="2" placeholder="Enter comment here..."></textarea><button id="post-comment" type="button" class="btn btn-primary">Post Comment</button>';

    $("#comments").append(commentForm);
}

// reload list and map with nearby buildings
function loadNearby(lat, lon) {
    $('#map-canvas').fadeOut(300).empty();
    $('#list-group').fadeOut(300);
    $('#search').fadeOut();
    getBuildings('/api/v1/building/get_nearby_buildings?lat=' + lat + '&' + 'lon=' + lon);
}

// reload list and map with user's favourite buildings
function loadFavourites() {
    $('#map-canvas').fadeOut(300).empty();
    $('#list-group').fadeOut(300);
    $('#search').fadeOut();
    getBuildings('/api/v1/user/get_favourite_buildings');
}

// reload list and map with all buildings
function loadAll() {
    $('#map-canvas').fadeOut(300).empty();
    $('#list-group').fadeOut(300);
    $('#search').fadeOut();
    getBuildings('/api/v1/building/get_all_buildings');
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
    console.log(user_lat + " " + user_lon);
    //loadNearby(user_lat, user_lon);
    loadNearby(43.663475, -79.397431);
}

$(document).ready(function() {
    console.log("Document ready.");

    // hide list and map before populating
    //$('#map-canvas').fadeOut();
    $('#list-group').fadeOut();
    $('#search').fadeOut();

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

    // load rooms list for building
    $('#list-group').on('click', '.btn-rooms', function(e) {
        // empty canvas to prep for comments
        $('#map-canvas').fadeOut(300).empty();

        // get building id and generate url with query
        buildingId = $(this).closest('.list-group-item').data("id");
        var url = '/api/v1/building/get_building_info?building_id=' + buildingId;
        console.log(url);
        getRooms(url);

        // stop click event for parent div
        e.stopPropagation();
    });

    // load room's schedule when clicked
    $('#rooms').on('click', '.room-link', function(e) {
        // empty canvas to prep for schedule
        $('#map-canvas').fadeOut(300).empty();

        // get room id and generate url with query
        var roomId = $(this).data("id");
        var url = '/api/v1/building/get_room_info?room_id=' + roomId;
        console.log(url);
        getSchedule(url);
    });

    // load comments for building
    $('#list-group').on('click', '.btn-comments', function(e) {
        // empty canvas to prep for comments
        $('#map-canvas').fadeOut(300).empty();

        // get building id and generate url with query
        buildingId = $(this).closest('.list-group-item').data("id");
        var url = '/api/v1/building/get_building_comments?building_id=' + buildingId;
        getComments(url);

        // stop click event for parent div
        e.stopPropagation();
    });

    // add building to user favourites
    $('#list-group').on('click', '.btn-fav', function(e) {
        // stop click event for parent div
        e.stopPropagation();
    });

    // dynamically update list based on search input
    $("#search").on('keyup', '#query', function() {
        var query = $.trim(this.value).toLowerCase();
        $('.list-group-item').hide();
        $('.list-group-item').each(function() {
            if ($(this).data("name").toLowerCase().indexOf(query) != -1) {
                $(this).show();
            }
        });
    });

    // add comment to database on post click
    $('#map-canvas').on('click', '#post-comment', function() {
        var title = $('#comment-title').val().trim();
        var message = $('#comment-txt').val().trim();

        if (!title.length || title.length > 20) {
            alert('Title is required and must be less than 20 characters.');
            console.log('Title is empty or too long.');
            return;
        }

        if (!message.length) {
            alert('Comment body is required.');
            console.log('Comment body is empty.');
            return;
        }

        // construct body for request
        var reqBody = {
            "building_id": buildingId,
            "title": title,
            "message": message
        };

        // add comment to database
        addComment(reqBody);

    });

    // user sign out
    $('#signout').click(function() {
        signOut();
    })
});

/* -------------- AJAX CALLS -------------- */

/* Ajax call to get buildings */
function getBuildings(url) {
    console.log(url);
    $.ajax({
        type: 'GET',
        url: url,
        success: function(data) {
            // clear old building and marker data
            buildingList = [];
            markers = [];
            var buildings = data.response;

            // check to see if building list is empty
            if (!buildings.length) {
                console.log('No buildings found.');
                return;
            }

            console.log("Success: buildings found.");
            addSearchBar();

            var txt = "";
            var id, name, address;
            for (var i = 0; i < buildings.length; i++) {
                // store name, slice address to keep only number and street name
                id = buildings[i].building_id;
                name = buildings[i].name.substring(0, buildings[i].name.lastIndexOf(" "));
                address = buildings[i].address.slice(0, buildings[i].address.indexOf(','));

                // create list-group-item with building info
                txt += '<a class="list-group-item" data-name="' + name + '" data-id="' + id + '">'
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

                // push building to building list
                buildingList.push([buildings[i].name, buildings[i].lat, buildings[i].lon]);
            }

            $("#list-group").html(txt);
            initMap();
            $('#search').fadeIn(300);
            $('#list-group').fadeIn(300);
            $('#map-canvas').fadeIn(300);
            $(".panel-footer").hide();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

/* Ajax call to get a building's rooms */
function getRooms(url) {
    console.log(url);
    $.ajax({
        type: 'GET',
        url: url,
        success: function(data) {
            console.log(JSON.stringify(data));
            // get json of available, soon to be available, and unavailable rooms
            var rooms = data.response.roomAvailability;

            // add div to hold rooms
            $('#map-canvas').html('<div id="rooms"></div>');

            // check to see if building list is empty
            if (!rooms.available.length &&
                !rooms.available_soon.length &&
                !rooms.unavailable.length) {
                console.log('No rooms found.');
                $('#rooms').html('<h2 class="header">No rooms found.</h2>');
                $('#map-canvas').fadeIn(300);
                return;
            }

            console.log("Success: rooms found.\n" + JSON.stringify(rooms));

            // add heading and tabbed nav menu for rooms
            $('#rooms').html('<h2 class="header">Rooms</h2><ul class="nav nav-tabs" role="tablist"><li role="presentation" class="active"><a href="#available" aria-controls="available" role="tab" data-toggle="tab">Available</a></li><li role="presentation"><a href="#available-soon" aria-controls="available-soon" role="tab" data-toggle="tab">Available Soon</a></li><li role="presentation"><a href="#unavailable" aria-controls="unavailable" role="tab" data-toggle="tab">Unavailable</a></li></ul><div class="tab-content"><div role="tabpanel" class="tab-pane fade in active" id="available"><div id="available-list" class="list-group col-md-12"></div></div><div role="tabpanel" class="tab-pane fade" id="available-soon"><div id="soon-list" class="list-group col-md-12"></div></div><div role="tabpanel" class="tab-pane fade" id="unavailable"><div id="unavailable-list" class="list-group col-md-12"></div></div></div>');

            // check each tab individually
            if (!rooms.available.length) {
                console.log('No available rooms found.');
                $('#available-list').html('<h3 class="header">No rooms found.</h3>');
                $('#map-canvas').fadeIn(300);
            }

            // check each tab individually
            if (!rooms.available_soon.length) {
                console.log('No available-soon rooms found.');
                $('#soon-list').html('<h3 class="header">No rooms found.</h3>');
                $('#map-canvas').fadeIn(300);
            }

            // check each tab individually
            if (!rooms.unavailable.length) {
                console.log('No unavailable rooms found.');
                $('#unavailable-list').html('<h3 class="header">No rooms found.</h3>');
                $('#map-canvas').fadeIn(300);
            }

            // vars to hold room info and html
            var txt, id, code, i;

            // add available rooms
            var available = rooms.available;
            for (i = 0; i < available.length; i++) {
                id = available[i][0];
                code = available[i][1];

                // create room panel
                txt += '<a data-id="' + id
                    + '" class="list-group-item list-group-item-action col-md-3 room-link">'
                    + code + '<i class="fa fa-caret-right pull-right" aria-hidden="true"></i></a>';
            }

            // add available room panels to list group
            $("#available-list").prepend(txt);

            // add available-soon rooms
            txt = "";
            var soon = rooms.available_soon;
            for (i = 0; i < soon.length; i++) {
                id = soon[i][0];
                code = soon[i][1];

                // create room panel
                txt += '<a data-id="' + id
                    + '" class="list-group-item list-group-item-action col-md-3 room-link">'
                    + code + '<i class="fa fa-caret-right pull-right" aria-hidden="true"></i></a>';
            }

            // add available-soon room panels to list group
            $("#soon-list").prepend(txt);

            // add unavailable rooms
            txt = "";
            var unavailable = rooms.unavailable;
            for (i = 0; i < unavailable.length; i++) {
                id = unavailable[i][0];
                code = unavailable[i][1];

                // create room panel
                txt += '<a data-id="' + id
                    + '" class="list-group-item list-group-item-action col-md-3 room-link">'
                    + code + '<i class="fa fa-caret-right pull-right" aria-hidden="true"></i></a>';
            }

            // add unavailable room panels to list group
            $("#unavailable-list").prepend(txt);
            $('#map-canvas').fadeIn(300);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

/* Ajax call to get a room's schedule */
function getSchedule(url) {
    console.log(url);
    $.ajax({
        type: 'GET',
        url: url,
        success: function(data) {
            console.log(JSON.stringify(data));
            return;
            // get json of available, soon to be available, and unavailable rooms
            var official = data.response;

            // add div to hold rooms
            $('#map-canvas').html('<div id="schedule"></div>');

            // check to see if building list is empty
            if (!rooms.available.length &&
                !rooms.available_soon.length &&
                !rooms.unavailable.length) {
                console.log('No rooms found.');
                $('#rooms').html('<h2 class="header">No rooms found.</h2>');
                $('#map-canvas').fadeIn(300);
                return;
            }

            console.log("Success: rooms found.\n" + JSON.stringify(rooms));

            // add heading and tabbed nav menu for rooms
            $('#rooms').html('<h2 class="header">Rooms</h2><ul class="nav nav-tabs" role="tablist"><li role="presentation" class="active"><a href="#available" aria-controls="available" role="tab" data-toggle="tab">Available</a></li><li role="presentation"><a href="#available-soon" aria-controls="available-soon" role="tab" data-toggle="tab">Available Soon</a></li><li role="presentation"><a href="#unavailable" aria-controls="unavailable" role="tab" data-toggle="tab">Unavailable</a></li></ul><div class="tab-content"><div role="tabpanel" class="tab-pane fade in active" id="available"><div id="available-list" class="list-group col-md-12"></div></div><div role="tabpanel" class="tab-pane fade" id="available-soon"><div id="soon-list" class="list-group col-md-12"></div></div><div role="tabpanel" class="tab-pane fade" id="unavailable"><div id="unavailable-list" class="list-group col-md-12"></div></div></div>');

            // check each tab individually
            if (!rooms.available.length) {
                console.log('No available rooms found.');
                $('#available-list').html('<h3 class="header">No rooms found.</h3>');
                $('#map-canvas').fadeIn(300);
            }

            // vars to hold room info and html
            var txt, id, code, i;

            // add available rooms
            var available = rooms.available;
            for (i = 0; i < available.length; i++) {
                id = available[i][0];
                code = available[i][1];

                // create room panel
                txt += '<a data-id="' + id
                    + '" class="list-group-item list-group-item-action col-md-3">'
                    + code + '<i class="fa fa-caret-right pull-right" aria-hidden="true"></i></a>';
            }

            // add available room panels to list group
            $("#available-list").prepend(txt);
            $('#map-canvas').fadeIn(300);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

/* Ajax call to get comments */
function getComments(url) {
    console.log(url);
    $.ajax({
        type: 'GET',
        url: url,
        success: function(data) {
            var comments = data.comments;
            $('#map-canvas').html(
                '<div id="comments"><div id="comments-list"></div></div>');

            // check to see if building list is empty
            if (!comments.length) {
                console.log('No comments found.');
                $('#comments').html('<h2 class="header">No comments found.</h2>');
                addCommentInput();
                $('#map-canvas').fadeIn(300);
                return;
            }

            console.log("Success: comments found.\n" + comments);
            $('#comments').prepend('<h2 class="header">Comments</h2>');

            var txt = "";
            var title, comment, date, datetime;
            for (var i = 0; i < comments.length; i++) {
                title = comments[i].title;
                comment = comments[i].message;
                date = new Date(Date.parse(comments[i].date_and_time)).toLocaleString();
                datetime = date.slice(date.indexOf(",") + 2) + ", "
                         + date.slice(0, date.indexOf(","));

                // create comment panel
                txt += '<div class="panel panel-default">'
                    + '<div class="panel-heading clearfix comment-header">'
                    + '<h3 class="panel-title pull-left">' + title + '</h3></div>'
                    + '<div class="panel-body comment-body">' + comment + '</div>'
                    + '<div class="panel-footer comment-date text-muted">' + datetime + '</div></div>';
            }

            $("#comments-list").prepend(txt);
            addCommentInput();
            $('#map-canvas').fadeIn(300);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

/* Ajax call to add a new comment */
function addComment(body) {
    $.ajax({
        url: '/api/v1/user/add_comment',
        type: "POST",
        headers: {
            'user_id': userId,
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(body),
        success: function(data) {
            console.log(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

// user sign out function
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log('User signed out.');
        location.href = "index.html";
    });
}
