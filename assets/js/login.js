function onSuccess(googleUser) {
    var profile = googleUser.getBasicProfile();
    var name = profile.getName();
    var email = profile.getEmail();
    console.log('Logged in as: ' + email);
    addUser('/api/v1/user/get_user_id?cookie=' + email, name);
}

function onFailure(error) {
    console.log(error);
}

function renderButton() {
    gapi.signin2.render('login-g', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}

/* Ajax call to get comments */
function addUser(url, name) {
    console.log(url);
    $.ajax({
        type: 'GET',
        url: url,
        success: function(data) {
            var id = data.user_id;
            console.log('User\'s id is: ' + id);
            location.href = "home.html?userid=" + id + "&name=" + name;
        }
    });
}