$( document ).ready(function() {
    $('#login-btn').click(login);
});

function login(){
	var $un = $("input[name=username]").val();
	var $pw = $("input[name=password]").val();
	if (!$un) {
		alert("Please enter username", "red");
		return;
	} else if (!$pw) {
		alert("Please enter password", "red");
		return;
	}

	var user_info = { username: $un, password: $pw };
  alert("Logged in with user: " + user_info.username);
  /*
	$.ajax({
        type: 'POST',
        url: '/login',
        data: user_info,
        success: function(r) {
        	var msg = JSON.parse(r).msg;
        	if (JSON.parse(r).success) {
        		noti(msg, "green");
            	setTimeout(function(){window.location.href = "./index";}, 500);
        	}
        	else {
        		noti(msg, "red");
        	}
        }
    });
    */
}
