var Model = library(function () {

    var _users = [];

    var VK_FIELDS = 'first_name, photo_50, screen_name';

    function createUsers (data) {
        if (data.length == 0)
        {
            mediator.publish('usersChange', _users);
            return;
        }

        var uids = [];
        for (var i = 0; i < data.length; i++) {
            uids.push(data[i].mid);
        }

        _users.length = 0;

        vk.call('users.get', { user_ids: uids, fields: VK_FIELDS }, function (r) {
            if (r.response) {
                for (var i = 0; i < r.response.length; i++) {
                    _users[i] = {
                        info: r.response[i],
                        location: {
                            latitude: data[i].latitude,
                            longitude: data[i].longitude
                        }
                    };
                }

                mediator.publish('usersChange', _users);
            }
        });
    }

    return {
        init: function () {
            // not implemented
        },

        update: function () {
            navigator.geolocation.getCurrentPosition(function (position) {
                var data = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    radius: 50000
                };
                server.sendRequest({ type: 'getUsers', data: data }, createUsers);
            });
        }
    };

}());
