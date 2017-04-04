/* SCRIPT FILE FOR DISCOVERUOFT WEBSITE */

var map;

// global list of buildings in format [name, lat, lon]
var buildingList = [];

// list of markers on map
var markers = []

// user's current latitude and longitude
var user_lat, user_lon;

// current user, building, and room ids being viewed
var userId, buildingId, roomId, roomCode;

// current page user is on {f, n, a}
var currentPage;

// load google auth API on page load
function onLoad() {
    gapi.load('auth2', function() {
        gapi.auth2.init();
    });
}

// initialize google map with building markers
function initMap() {
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
        this.setZoom(16);
        google.maps.event.removeListener(boundsListener);
    });
}

// resize map on show
function resize() {
    if (typeof(map) != "undefined") {
        // okay, we've got a map and we need to resize it
        var center = map.getCenter();
        google.maps.event.trigger(map, 'resize');
        map.setCenter(center);
    }
}


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
    var commentForm = '<textarea id="comment-title" class="form-control" rows="1" placeholder="Enter title here (max 20 chars)..."></textarea><textarea id="comment-txt" class="form-control" rows="2" placeholder="Enter comment here..."></textarea><button id="post-comment" type="button" class="btn btn-info">Post Comment</button>';

    $("#comments").append(commentForm);
}


// add button for booking rooms
function addBookingButton() {
    var button = '<button id="btn-book" type="button" class="btn btn-info">Book This Room</button>';

    $('#schedule').append(button);
}


// reload list and map with nearby buildings
function loadNearby(lat, lon) {
    $('#map-canvas').fadeOut(300).empty();
    $('#list-group').fadeOut(300);
    $('#search').fadeOut();
    currentPage = "n";
    makeBuildingList('/api/v1/building/get_nearby_buildings?lat=' + lat + '&' + 'lon=' + lon);
}


// reload list and map with user's favourite buildings
function loadFavourites() {
    $('#map-canvas').fadeOut(300).empty();
    $('#list-group').fadeOut(300);
    $('#search').fadeOut();
    currentPage = "f";
    makeBuildingList('/api/v1/user/get_favourite_buildings');
}


// reload list and map with all buildings
function loadAll() {
    $('#map-canvas').fadeOut(300).empty();
    $('#list-group').fadeOut(300);
    $('#search').fadeOut();
    currentPage = "a";
    makeBuildingList('/api/v1/building/get_all_buildings');
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


// validate time input HHMM
function validateTime(input) {
    return /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(input.value);;
}


$(document).ready(function() {
    console.log("Document ready.");

    // get user id from href
    var l = location.href;
    userId = l.slice(l.indexOf("=") + 1, l.indexOf("&"));
    name = l.slice(l.lastIndexOf("=") + 1, l.indexOf("%"));
    $('#tagline').text('Welcome, ' + name + '! Browse buildings and find a room below.');

    // hide list and map before populating
    //$('#map-canvas').fadeOut();
    $('#list-group').fadeOut();
    $('#search').fadeOut();

    // homepage defaults to favourite buildings
    loadFavourites();
    currentPage = "f";

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
        getRooms(url);

        // stop click event for parent div
        e.stopPropagation();
    });


    // load room's schedule when clicked
    $('#map-canvas').on('click', '.room-link', function() {
        // empty canvas to prep for schedule
        $('#map-canvas').fadeOut(300).empty();

        // get room id and generate url with query
        roomId = $(this).data("id");
        roomCode = $(this).data("code");
        // get building id and generate url with query
        buildingId = $(this).closest('.list-group-item').data("id");
        var url = '/api/v1/building/get_building_info?building_id=' + buildingId;
        getRooms(url);
    });


    // load forms when book room is clicked
    $('#map-canvas').on('click', '#btn-book', function() {
        // empty canvas to prep for booking form
        $('#map-canvas').fadeOut(300).empty();
        gotoBookingForm();
    });


    // create new booking
    $('#map-canvas').on('click', '#btn-confirm-booking', function() {
        // empty canvas to prep for booking form
        $('#map-canvas').fadeOut(300).empty();

        // extract user input
        var activity = $('#activity').val().trim();
        var start = $('#start').val().trim();
        var end = $('#start').val().trim();

        if (!activity.length || activity.length > 30) {
            alert('Activity is required and must be less than 30 characters.');
            console.log('Activity is empty or too long.');
            return;
        }

        if (!start.length) {
            alert('Start time is required.');
            console.log('Start time is empty.');
            return;
        }

        if (!end.length) {
            alert('End time is required.');
            console.log('End time is empty.');
            return;
        }

        if (validateTime(start) || validateTime(end)) {
            alert('Times must be given in HH:MM 24 hour format.');
            console.log('Time is formatted incorrectly.');
            return;
        }

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
        // get building id of card clicked
        buildingId = $(this).closest('.list-group-item').data("id");

        // add building to user's favourites
        $(this).html('<i class="fa fa-star"></i> Unfavourite');
        $(this).removeClass("btn-info btn-fav");
        $(this).addClass("btn-danger btn-unfav");
        addFavourite();

        // stop click event for parent div
        e.stopPropagation();
    });


    // remove building from user favourites
    $('#list-group').on('click', '.btn-unfav', function(e) {
        // get building id of card clicked
        buildingId = $(this).closest('.list-group-item').data("id");

        // remove building from user's favourites
        $(this).html('<i class="fa fa-star"></i> Favourite');
        $(this).removeClass("btn-danger btn-unfav");
        $(this).addClass("btn-info btn-fav");
        delFavourite();

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

        var url = '/api/v1/building/get_building_comments?building_id=' + buildingId;

        // add comment to database
        addComment(reqBody, url);
    });


    // user sign out
    $('#signout').click(function() {
        signOut();
    })
});


/* -------------- AJAX CALLS AND ONCLICK FUNCTIONS -------------- */


function makeBuildingList(url) {
    getFavourites(getBuildings, url);
}

/* Ajax call to get buildings */
function getBuildings(url, favs) {
    console.log(url);
    $.ajax({
        type: 'GET',
        url: url,
        headers: {
            'user_id': userId,
        },
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
            var id, name, address, btnfav;
            for (var i = 0; i < buildings.length; i++) {
                if (buildings[i].lat < 43.63) {
                    continue;
                }

                // store name, slice address to keep only number and street name
                id = buildings[i].building_id;
                name = buildings[i].name.substring(0, buildings[i].name.lastIndexOf(" "));
                address = buildings[i].address.slice(0, buildings[i].address.indexOf(','));

                if (favs.indexOf(id) > -1) {
                    btnfav = '<div class="btn-group"><button class="btn btn-danger btn-unfav"><i class="fa fa-star"></i> Unfavourite</button></div></div></div></a>';
                } else {
                    btnfav = '<div class="btn-group"><button class="btn btn-info btn-fav"><i class="fa fa-star"></i> Favourite</button></div></div></div></a>';
                }

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
                    + btnfav;

                // push building to building list
                buildingList.push([buildings[i].name, buildings[i].lat, buildings[i].lon]);
            }

            $("#list-group").html(txt);
            initMap();
            $('#search').fadeIn(300);
            $('#list-group').fadeIn(300);
            $('#map-canvas').fadeIn(300, function() { resize(); });
            $(".panel-footer").hide();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

/* Ajax call to get buildings */
function getFavourites(callback, callback_url) {
    $.ajax({
        type: 'GET',
        url: '/api/v1/user/get_favourite_buildings',
        headers: {
            'user_id': userId,
        },
        success: function(data) {
            var buildings = data.response;

            // put all favourite building ids into an array
            var ids = [];
            for (var i = 0; i < buildings.length; i++) {
                ids.push(buildings[i].building_id);
            }

            callback(callback_url, ids);
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
                $('#map-canvas').fadeIn(300, function() { resize(); });
                return;
            }

            console.log("Success: rooms found.");

            // add heading and tabbed nav menu for rooms
            $('#rooms').html('<h2 class="header">Rooms</h2><ul class="nav nav-tabs" role="tablist"><li role="presentation" class="active"><a href="#available" aria-controls="available" role="tab" data-toggle="tab">Available</a></li><li role="presentation"><a href="#available-soon" aria-controls="available-soon" role="tab" data-toggle="tab">Available Soon</a></li><li role="presentation"><a href="#unavailable" aria-controls="unavailable" role="tab" data-toggle="tab">Unavailable</a></li></ul><div class="tab-content"><div role="tabpanel" class="tab-pane fade in active" id="available"><div id="available-list" class="list-group col-md-12"></div></div><div role="tabpanel" class="tab-pane fade" id="available-soon"><div id="soon-list" class="list-group col-md-12"></div></div><div role="tabpanel" class="tab-pane fade" id="unavailable"><div id="unavailable-list" class="list-group col-md-12"></div></div></div>');

            // check each tab individually
            if (!rooms.available.length) {
                console.log('No available rooms found.');
                $('#available-list').html('<h3 class="header">No rooms found.</h3>');
                $('#map-canvas').fadeIn(300, function() { resize(); });
            }

            // check each tab individually
            if (!rooms.available_soon.length) {
                console.log('No available-soon rooms found.');
                $('#soon-list').html('<h3 class="header">No rooms found.</h3>');
                $('#map-canvas').fadeIn(300, function() { resize(); });
            }

            // check each tab individually
            if (!rooms.unavailable.length) {
                console.log('No unavailable rooms found.');
                $('#unavailable-list').html('<h3 class="header">No rooms found.</h3>');
                $('#map-canvas').fadeIn(300, function() { resize(); });
            }

            // vars to hold room info and html
            var txt = "", id, code, i;

            // add available rooms
            var available = rooms.available;
            for (i = 0; i < available.length; i++) {
                id = available[i][1];
                code = available[i][0];

                // create room panel
                txt += '<a data-code="' + code + '" data-id="' + id
                    + '" class="list-group-item list-group-item-action col-md-3 room-link">'
                    + code + '<i class="fa fa-caret-right pull-right" aria-hidden="true"></i></a>';
            }

            // add available room panels to list group
            $("#available-list").prepend(txt);

            // add available-soon rooms
            txt = "";
            var soon = rooms.available_soon;
            for (i = 0; i < soon.length; i++) {
                id = soon[i][1];
                code = soon[i][0];

                // create room panel
                txt += '<a data-code="' + code + '" data-id="' + id
                    + '" class="list-group-item list-group-item-action col-md-3 room-link">'
                    + code + '<i class="fa fa-caret-right pull-right" aria-hidden="true"></i></a>';
            }

            // add available-soon room panels to list group
            $("#soon-list").prepend(txt);

            // add unavailable rooms
            txt = "";
            var unavailable = rooms.unavailable;
            for (i = 0; i < unavailable.length; i++) {
                id = unavailable[i][1];
                code = unavailable[i][0];

                // create room panel
                txt += '<a data-code="' + code + '" data-id="' + id
                    + '" class="list-group-item list-group-item-action col-md-3 room-link">'
                    + code + '<i class="fa fa-caret-right pull-right" aria-hidden="true"></i></a>';
            }

            // add unavailable room panels to list group
            $("#unavailable-list").prepend(txt);
            $('#map-canvas').fadeIn(300, function() { resize(); });
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
            // get lists of official and user bookings
            var officialBookings = data.result.schedule;
            var userBookings = data.result.bookings;

            // add div to hold rooms
            $('#map-canvas').html('<div id="schedule"></div>');

            // check to see if building list is empty
            if (!officialBookings.length &&
                !userBookings.length) {
                console.log('No bookings found.');
                $('#schedule').html('<h2 class="header">No bookings found.</h2>');
                addBookingButton();
                $('#map-canvas').fadeIn(300, function() { resize(); });
                return;
            }

            // add heading and tabbed nav menu for rooms
            $('#schedule').html('<h2 class="header">Room Bookings</h2><ul class="nav nav-tabs" role="tablist"><li role="presentation" class="active"><a href="#official" aria-controls="official" role="tab" data-toggle="tab">Official Schedule</a></li><li role="presentation"><a href="#user-bookings" aria-controls="user-bookings" role="tab" data-toggle="tab">User Bookings</a></li></ul><div class="tab-content"><div role="tabpanel" class="tab-pane fade in active" id="official"></div><div role="tabpanel" class="tab-pane fade" id="user-bookings"></div></div>');

            // check each tab individually
            if (!officialBookings.length) {
                console.log('No official bookings found.');
                $('#official').html('<h3 class="header">No bookings found.</h3>');
                $('#map-canvas').fadeIn(300, function() { resize(); });
            } else {
                // add table structure to official tab
                $('#official').html('<div class="table-responsive"><table class="table table-striped"><thead><tr><th>Start Time</th><th>End Time</th><th>Activity</th></tr></thead><tbody id="official-data"></tbody></table></div>');
            }

            // check each tab individually
            if (!userBookings.length) {
                console.log('No user bookings found.');
                $('#user-bookings').html('<h3 class="header">No bookings found.</h3>');
                $('#map-canvas').fadeIn(300, function() { resize(); });
            } else {
                // add table structure to user tab
                $('#user-bookings').html('<div class="table-responsive"><table class="table table-striped"><thead><tr><th>Start Time</th><th>End Time</th><th>Activity</th></tr></thead><tbody id="user-data"></tbody></table></div>');
            }

            // vars to hold room info and html
            var txt = "", start, end, activity;

            // add official bookings to table
            for (i = 0; i < officialBookings.length; i++) {
                start = get12Hour(officialBookings[i].start_time);
                end = get12Hour(officialBookings[i].end_time);
                activity = officialBookings[i].activity;

                // create room panel
                txt += '<tr><td>' + start
                    + '</td><td>' + end
                    + '</td><td>' + activity + '</td></tr>';
            }

            // add available room panels to list group
            $("#official-data").append(txt);

            // add user bookings to table
            txt = ""
            for (i = 0; i < userBookings.length; i++) {
                start = get12Hour(userBookings[i].start_time);
                end = get12Hour(userBookings[i].end_time);
                activity = userBookings[i].message;

                // create room panel
                txt += '<tr><td>' + start
                    + '</td><td>' + end
                    + '</td><td>' + activity + '</td></tr>';
            }

            // add available room panels to list group
            $("#user-data").append(txt);
            addBookingButton();
            $('#map-canvas').fadeIn(300, function() { resize(); });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}


// Helper function that converts 24H time to 12H
function get12Hour(time) {
    var timeArray = time.split(":");

    // determine whether time is in AM or PM
    var suffix = (parseInt(timeArray[0]) >= 12) ? " PM" : " AM";

    // turn 24 hours to 12
    var hours = ((parseInt(timeArray[0]) + 11) % 12 + 1);

    // build new time string and return
    var newTime = hours + ":" + timeArray[1] + suffix;
    return newTime;
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
                $('#map-canvas').fadeIn(300, function() { resize(); });
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
            $('#map-canvas').fadeIn(300, function() { resize(); });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}


/* Ajax call to add a new comment */
function addComment(body, reloadUrl) {
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
            getComments(reloadUrl);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}


/* Ajax call to add a building to user's favourites */
function addFavourite() {
    $.ajax({
        url: '/api/v1/user/add_favourite_building',
        type: "POST",
        headers: {
            'user_id': userId,
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({"building_id": buildingId}),
        success: function(data) {
            console.log("User " + userId + " favourited building " + buildingId);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}


/* Ajax call to add a building to user's favourites */
function delFavourite() {
    $.ajax({
        url: '/api/v1/user/delete_favourite_building',
        type: "POST",
        headers: {
            'user_id': userId,
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({"building_id": buildingId}),
        success: function(data) {
            console.log("User " + userId + " unfavourited building " + buildingId);
            if (currentPage == "f") {
                loadFavourites();
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}


/* Load room booking form */
function gotoBookingForm() {
    $('#map-canvas').html('<div id="booking-form"><h2 class="header">Create Booking</h2><form class="form-horizontal"><div class="form-group"><label class="col-sm-3 control-label">Room</label><div class="col-sm-7"><p id="room" class="form-control-static">' + roomCode + '</p></div></div><div class="form-group"><label for="activity" class="col-sm-3 control-label">Activity</label><div class="col-sm-7"><input type="text" class="form-control" id="activity" placeholder="What are you doing? (max 30 characters)"></div></div><div class="form-group"><label for="start" class="col-sm-3 control-label">Start Time</label><div class="col-sm-4"><input type="text" class="form-control" id="start" placeholder="HH:MM (24 hour)"></div></div><div class="form-group"><label for="end" class="col-sm-3 control-label">End Time</label><div class="col-sm-4"><input type="text" class="form-control" id="end" placeholder="HH:MM (24 hour)"></div></div><div class="form-group"><div class="col-sm-9 col-sm-offset-3"> <button id="btn-confirm-booking" type="button" class="btn btn-info">Save Booking</button></div></div></form></div>');

    // show form
    $('#map-canvas').fadeIn(300, function() { resize(); });
}

/* Sign user out of app, redirect to login page */
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log('User signed out.');
        location.href = "index.html";
    });
}
