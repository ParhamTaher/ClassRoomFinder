
// Get building data
function getNearbyBuildings() {
		$.get('/getNearbyBuildingsData', function(r){
			var data = JSON.parse(r);
		if (data.success && data.msg) {
      buildBuildingList(JSON.parse(data.msg));
		} else {
      console.log('Error getting building list')
		}
	});
}

function buildBuildingList(building_list) {
	// For reach building in buildBuildingList
		// Create clickable button for the building in sideNav
		//Use this
		$('.sideNav').append("<div>hello</div>");

		//Add on click event for each button


}

function loadRooms(building_name) {

}


// On load, run this
$( document ).ready(function() {
	buildBuildingList(5);

  $("#nearbybtn_id").addClass("active");
	$("#favouritesbtn_id").removeClass("active");
	$("#allbuildingsbtn_id").removeClass("active");
});
