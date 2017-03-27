var roomNumber = "";

$(document).ready(function() {
    $('.roomBtn').click(function() {

        roomNumber = $(this).html()
        //alert(roomNumber);
        $('#room_info').removeClass("hidden");
        $('#building_rooms').addClass("hidden");
  });

  $('#commentBtn').click(function() {
      $('#comments_section').removeClass("hidden");
      $('#room_info').addClass("hidden");
  });


  $('#submitComment').click(function() {
    $('#comments').append('<div class="comment">' + $('#commentText').val() + '</div>')
  });
});
