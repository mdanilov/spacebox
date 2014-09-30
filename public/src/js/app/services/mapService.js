function MapService ($log, GeolocationService) {

    var MapService = {};

    MapService._markers = {};
    MapService._map = {};
    MapService.MAPBOX = {
        ACCESS_TOKEN: 'pk.eyJ1IjoibWRhbmlsb3YiLCJhIjoiV29JVmpxdyJ9.sBimZ4oSZYSFTdcZIgnQfQ',
        URL: 'mdanilov.j8f4ggll'
    };

    function addMarker (user) {
        var innerHtml = '<img src=' + user.photoUrl +  '>';
        var icon = L.divIcon({
            className: 'map-marker-icon',
            html: innerHtml,
            iconSize: [60, 60]
        });

        var marker = L.marker([user.location.latitude, user.location.longitude], {icon: icon});
        marker.addTo(MapService._map);

        MapService._markers[user.uid] = marker;
    }

    MapService.init = function () {
        L.mapbox.accessToken = MapService.MAPBOX.ACCESS_TOKEN;
        MapService._map = L.mapbox.map('map-canvas', MapService.MAPBOX.URL).setView([60, 30], 10);
        GeolocationService.getCurrentPosition(function (position) {
            var pos = L.latLng(position.coords.latitude, position.coords.longitude);
            MapService._map.setView(pos, 15);
        });
        MapService._map.invalidateSize();
    };

    MapService.invalidateSize = function () {
        MapService._map.invalidateSize();
    };

    MapService.invalidateUsers = function (users) {
        MapService.clear();
        for (var i = 0; i < users.length; i++) {
            addMarker(users[i]);
        }
    };

    MapService.clear = function () {
        for (var key in MapService._markers) {
            if (!MapService._markers.hasOwnProperty(key)) continue;
            MapService._map.removeLayer(MapService._markers[key]);
            delete MapService._markers[key];
        }
    };

    return MapService;
}

angular.module('spacebox')
    .factory('MapService', ['$log', 'GeolocationService', MapService]);