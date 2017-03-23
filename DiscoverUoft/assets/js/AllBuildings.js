function getAllBuildings() {
		$.get('/api/v1/building/get_all_buildings', function(r){
			var data = JSON.parse(r);
		if (data.success && data.msg) {
      buildBuildingList(JSON.parse(data.msg));
		} else {
      console.log('Error getting building list')
		}
	});
}

function buildBuildingList(building_list) {
  //console.log(building_list.name);
  $('.sideNav').append("<div class=\"sidenavbtn\" name=\"Building3\">building3</div>");
  $('.sideNav').append("<div class=\"sidenavbtn\">building4</div>");

}

$( document ).ready(function() {
  $("#nearbybtn_id").removeClass("active");
	$("#favouritesbtn_id").removeClass("active");

  // add class to the one we clicked
  $("#allbuildingsbtn_id").addClass("active");
  buildBuildingList(2);
});
