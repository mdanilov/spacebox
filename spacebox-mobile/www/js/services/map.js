var Map = function () {

    var _markers = {};
    var _map;

    var MAPBOX = {
        ACCESS_TOKEN: 'pk.eyJ1IjoibWRhbmlsb3YiLCJhIjoiV29JVmpxdyJ9.sBimZ4oSZYSFTdcZIgnQfQ',
        URL: 'mdanilov.j8f4ggll'
    };

    function handleNoGeolocation (errorFlag) {
        if (errorFlag) {
            mediator.publish('error', 'Мне кажется, ты забыл включить геолокацию :(');
        } else {
            mediator.publish('error', 'Ваш браузер не поддерживает геолокацию');
        }
    }

    function addMarker (user) {
        var innerHtml = '<img src=' + user.info.photo_50 +  '>';
        var icon = L.divIcon({
            className: 'map-marker-icon',
            html: innerHtml,
            iconSize: [60, 60]
        });

        var location = user.location;
        var marker = L.marker([location.latitude, location.longitude], {icon: icon});
        marker.addTo(_map);

        _markers[user.info.id] = marker;
    }

    function invalidateUsers (users) {
        Map.clear();
        for (var i = 0; i < users.length; i++) {
            addMarker(users[i])
        }
    }

    return {
        init: function () {
            var mapContainer = document.getElementById('map-canvas');
            mapContainer.style.width = '70%';
            mapContainer.style.height = '500px';
            
            L.mapbox.accessToken = MAPBOX.ACCESS_TOKEN;
            _map = L.mapbox.map(mapContainer, MAPBOX.URL).setView([60, 30], 10);

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = L.latLng(position.coords.latitude, position.coords.longitude);
                    _map.setView(pos, 15);
                }, function () {
                    handleNoGeolocation(true);
                });
            }
            else {
                handleNoGeolocation(false);
            }

            mediator.subscribe('usersChange', invalidateUsers);
        },

        invalidate: function () {
            _map.invalidateSize();
        },

        clear: function () {
            for (var key in _markers) {
                if (!_markers.hasOwnProperty(key)) continue;
                _map.removeLayer(_markers[key]);
                delete _markers[key];
            }
        }
    };

}();
