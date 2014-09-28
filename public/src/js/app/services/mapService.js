function MapService ($scope, $log, GeolocationService) {

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

    L.mapbox.accessToken = MAPBOX.ACCESS_TOKEN;
    MapService._map = L.mapbox.map('map-canvas', MAPBOX.URL).setView([60, 30], 10);
    GeolocationService.getCurrentPosition(function (position) {
        var pos = L.latLng(position.coords.latitude, position.coords.longitude);
        MapService._map.setView(pos, 15);
    });

    MapService.invalidateSize = function () {
        MapService._map.invalidateSize();
    };

    MapService.invalidateUsers = function () {
        MapService.clear();
        for (var i = 0; i < $scope.users.length; i++) {
            addMarker($scope.users[i]);
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

angular.module('spacebox.mapService', [])
    .factory('MapService', ['$scope', '$log', GeolocationService, MapService]);
