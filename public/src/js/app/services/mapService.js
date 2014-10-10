function MapService ($log, $filter, GeolocationService) {

    var MapService = {};

    MapService._markers = {};
    MapService._map = {};
    MapService._locator = {};
    MapService.MAPBOX = {
        ACCESS_TOKEN: 'pk.eyJ1IjoibWRhbmlsb3YiLCJhIjoiV29JVmpxdyJ9.sBimZ4oSZYSFTdcZIgnQfQ',
        URL: 'mdanilov.j8f4ggll'
    };

    function bindPopupWindow (marker, user) {
        marker.bindPopup([
            '<div style="overflow:hidden;width:200px;">',
                '<div style="float:left;">',
                    '<img src="' + user.largePhotoUrl + '" alt="icon">',
                '</div>',
                '<div style="float:left;padding:5px;">',
                    '<h4>' + user.firstName + '</h4>',
                    '<p>' + $filter('age')(user.bdate) + '</p>',
                    '<p>' + $filter('distance')(user.distance) + '</p>',
                '</div>',
            '</div>'
        ].join(''));

        marker.on('mouseover', marker.openPopup);
        marker.on('mouseout', marker.closePopup);

        marker.on('click', function () {
            marker.openPopup();
            marker.off('mouseout');
            marker.isClicked = true;
        });
        marker.on('popupclose', function () {
            if (marker.isClicked) {
                marker.on('mouseout', marker.closePopup);
                marker.isClicked = false;
            }
        });
    }

    function addMarker (user) {
        var icon = L.divIcon({
            className: 'info',
            html: '<span class="icon icon-material-accessibility icon-material-indigo user-marker"></span>',
            iconSize: [30, 30]
        });

        var marker = L.marker([user.location.latitude, user.location.longitude], {icon: icon});
        marker.addTo(MapService._map);

        MapService._markers[user.uid] = marker;

        return marker;
    }

    function initializeLocator () {
        var icon = L.divIcon({
            className: 'info',
            html: '<span class="icon icon-material-place icon-material-red locator-marker"></span>',
            iconSize: [40, 40]
        });

        MapService._locator = L.control.locate({
            drawCircle: false,
            follow: false,
            setView: true,
            markerClass: L.marker.bind(L.marker, L.latLng(0, 0), {icon: icon}),
            remainActive: true,
            keepCurrentZoomLevel: true,
            icon: 'icon icon-material-location map-icon-location',
            showPopup: false,
            strings: {
                title: "Мое текущее местоположение",
                popup: "",
                outsideMapBoundsMsg: ""
            }
        }).addTo(MapService._map);

        MapService._locator.locate();
    }

    MapService.init = function () {
        L.mapbox.accessToken = MapService.MAPBOX.ACCESS_TOKEN;
        MapService._map = L.mapbox.map('map-canvas', MapService.MAPBOX.URL).setView([60, 30], 10);
        GeolocationService.getCurrentPosition(function (position) {
            var pos = L.latLng(position.coords.latitude, position.coords.longitude);
            MapService._map.setView(pos, 15);
        });
        MapService._map.invalidateSize();

        initializeLocator();
    };

    MapService.setCenter = function (location) {
        var pos = L.latLng(location.latitude, location.longitude);
        MapService._map.setView(pos, 15);
    };

    MapService.invalidateSize = function () {
        MapService._map.invalidateSize();
    };

    MapService.invalidateUsers = function (users) {
        MapService._locator.locate();
        MapService.clear();
        for (var i = 0; i < users.length; i++) {
            var marker = addMarker(users[i]);
            bindPopupWindow(marker, users[i]);
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
    .factory('MapService', ['$log', '$filter', 'GeolocationService', MapService]);
