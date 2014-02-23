var vkSession;

$(document).ready(function() {
    $('#button').click(function(event) {
        event.preventDefault();
        addUser();
    });

    $('#button1').click(function(event) {
        event.preventDefault();
        sendCurrentPosition();
    });
});

function initializeSession(session) {
    vkSession = session;
    $('div#login').hide();
    $('div#menu').show();
}

function closeSession() {
    vkSession = null;
    $('div#login').show();
    $('div#menu').hide();
}

function addUser() {
    $.get("/user",
        {
            user_id: Math.floor(Math.random() * 100),
            latitude: Math.random() * (60 - 59.9) + 59.9,
            longitude: Math.random() * (30.5 - 30.4) + 30.4
        },
        function (data) {
            refreshMapMarkers(data)
        }, "json");
}

function sendCurrentPosition() {
    navigator.geolocation.getCurrentPosition(function(position) {
        $.get("/user",
        {
            user_id: vkSession.mid,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },
        function (data) {
            refreshMapMarkers(data)
        }, "json");
    });
}