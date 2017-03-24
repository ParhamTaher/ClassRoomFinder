var buildingName = "";

function loadRooms() {

}

function loadLabs() {

}

function getBuilingNameFromBtnClicked() {
  return
}


$(document).ready(function() {

  $('.list-group-item').click(function() {
      buildingName = $(this).attr("name");
      //alert(buildingName);

  });

  $('.rooms-sub-nav').click(function() {
      //alert("Room!");
      $('#building_rooms').removeClass("hidden");
      $('#map-canvas').addClass("hidden");

      $(".buildingName").html(buildingName + " -> Rooms");
  });

  $('.labs-sub-nav').click(function() {
      //alert("Lab!");
      $('#building_rooms').removeClass("hidden");
      $('#map-canvas').addClass("hidden");

      $(".buildingName").html(buildingName + " -> Labs");
  });

  $('.lecture-sub-nav').click(function() {
      //alert("Lecture Hall!");
      $('#building_rooms').removeClass("hidden");
      $('#map-canvas').addClass("hidden");

      $(".buildingName").html(buildingName + " -> Lecture Halls");
  });

});
