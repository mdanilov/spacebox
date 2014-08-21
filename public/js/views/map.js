var Map = library(function () {

    var _markers = [];
    var _map;

    function handleNoGeolocation (errorFlag) {
        if (errorFlag) {
            var content = 'Error: The Geolocation service failed.';
        } else {
            var content = 'Error: Your browser doesn\'t support geolocation.';
        }

        var options = {
            map: _map,
            position: L.latLng(60, 105),
            content: content
        };

        _map.setView(options.position);
    }

    function invalidateUsers (users) {
        Map.clear();
        for (var i = 0; i < users.length; i++) {
            Map.addMarker(users[i].location, users[i])
        }
    }

    return {
        init: function () {

            L.mapbox.accessToken = 'pk.eyJ1IjoibWRhbmlsb3YiLCJhIjoiV29JVmpxdyJ9.sBimZ4oSZYSFTdcZIgnQfQ';
            _map = L.mapbox.map('map-canvas', 'mdanilov.j8f4ggll').setView([51.505, -0.09], 15);

            // Try HTML5 geolocation
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = L.latLng(position.coords.latitude, position.coords.longitude);
                    _map.setView(pos, 15);
                }, function () {
                    handleNoGeolocation(true);
                });
            }
            else {
                // Browser doesn't support Geolocation
                handleNoGeolocation(false);
            }

            mediator.subscribe('usersChange', invalidateUsers);
        },

        addMarker: function (options) {

            var icon = L.icon({
                iconUrl: './images/marker-icon.png'
            });

            var marker = L.marker([options.latitude, options.longitude], {icon: icon});

            marker.addTo(_map);
            _markers.push(marker);
        },

        invalidate: function () {
            _map.invalidateSize();
        },

        clear: function () {
            if (_markers) {
                for (var i in _markers) {
                    _map.removeLayer(_markers[i])
                }
                _markers.length = 0;
            }
        }
    };

}());
