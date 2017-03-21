
function getNearbyBuildings() {
		$.get('/getNearbyBuildingsData', function(r){
			var data = JSON.parse(r);
		if (data.success && data.msg) {
      var building List = JSON.parse(data.msg);
		} else {
      console.log('Error getting building list')
		}
	});
}


$( document ).ready(function() {
  getNearbyBuildings();
});
