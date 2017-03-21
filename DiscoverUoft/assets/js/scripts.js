
// On click of a sidenav button, load building room info
function getBuildingInfo() {
  $.get('/getBuildingInfo', function(data){
		if (data) {
			if (data.username && data.verbose) {
				$($("#nav-pbrief").find("span")[0]).html(data.username);
				$($("#nav-pbrief").find("span")[1]).html(data.verbose);
			}
		}
	});
}



$('.tabMenuBtn').click(function(){
  console.log("helooo");
  $(this).addClass("tabMenuBtnActive");
});
