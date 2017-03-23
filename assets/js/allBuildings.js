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

/* Ajax call to get buildings */
function getbuildings() {
    $.ajax({
        url: '/api/v1/building/get_all_buildings',
        method: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(data) {
        }
    });
}
