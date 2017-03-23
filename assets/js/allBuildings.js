// jQuery Document
var map, marker;

$(document).ready(function() {
    initMap();
});

function initMap() {
    var uluru = { lat: 43.660411, lng: -79.396959 };
    map = new google.maps.Map(document.getElementById('map'),, {
        zoom: 4,
        center: uluru
    });
    marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
}

<a class="list-group-item" href="#">
        <div class="row">
          <div class="col-sm-9">
            <h4 class="card-heading list-group-item-heading">Bahen Center</h4>
            <p class="list-group-item-text">17 Free Rooms</p>
          </div>
          <div class="card-icon col-sm-3">
            <i class="fa fa-angle-right fa-3x pull-right" aria-hidden="true"></i>
          </div>
        </div>
      </a>

/* Ajax call to get buildings */
function getbuildings() {
    $.ajax({
        url: '/api/v1/building/get_all_buildings',
        method: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(data) {
        	var buildings = data;
        	if (!buildings.length) {
        		console.log('No buildings found.');
        	}

        	var txt = "";
        	for (var i = 0; i < buildings.length; i++) {
        		txt += '<a class="list-group-item" href="' + buildings[i].name + '-info.html">'
        			+ '<div class="row"><div class="col-sm-9">'
        			+ '<h4 class="card-heading list-group-item-heading">' + buildings[i].name + '</h4>'
        			+ '<p class="list-group-item-text">' + buildings[i].address +
        	}
        }
    });
}
