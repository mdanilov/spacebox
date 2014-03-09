﻿function Context() {

    var _session = VK.Auth.getSession();
    var _users = [];

    function createUsers(data, callback) {

        if (data.length == 0)
        {
            callback();
            return;
        }

        var uids = [];
        for (var i = 0; i < data.length; i++) {
            uids.push(data[i].mid);
        }

        _users.length = 0;

        VK.Api.call('users.get', { uids: uids, fields: VK_FIELDS }, function (r) {
            if (r.response) {
                for (var i = 0; i < r.response.length; i++) {
                    _users[i] = new User({
                        info: r.response[i],
                        location: {
                            latitude: data[i].latitude,
                            longitude: data[i].longitude
                        }
                    });
                }
                callback();
            }
        });
    }

    this.getUsers = function() {
        return _users;
    }

    this.update = function(callback) {
        navigator.geolocation.getCurrentPosition(function(position) {
            $.get("/user",
            {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                radius: 1000
            },
            function(data) {
                createUsers(data, callback);
            }, "json");
        });
    }
};