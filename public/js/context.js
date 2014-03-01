var context = new Context();

function Context() {

    var _session = VK.Auth.getSession();
    var VK_FIELDS = 'first_name, photo_medium';

    function getUsers(data) {
        var uids = [];
        for (var i = 0; i < data.length; i++) {
            uids.push(data[i].user_id);
        }

        VK.Api.call('users.get', { uids: uids, fields: VK_FIELDS }, function (r) {
            if (r.response) {
                $('#list-users').empty();
                for (var i = 0; i < r.response.length; i++) {
                    $('#list-users').append('<img src="' + r.response[i].photo_medium + '"> ' + r.response[i].first_name + '</br>');
                }
            }
        });
    }

    this.update = function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            $.get("/user",
            {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            },
            function(data) {
                getUsers(data);
                Map.deleteAllMarkers();
                for (var i = 0; i < data.length; i++) {
                    Map.addMarker(data[i])
                }
            }, "json");
        });
    }
};
