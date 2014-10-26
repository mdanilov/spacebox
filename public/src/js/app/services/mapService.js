function MapService ($log, $filter, GeolocationService) {

    var MapService = {};

    MapService._markers = {};
    MapService._map = {};
    MapService._locator = {};
    MapService._popupFixed = false;
    MapService.MAPBOX = {
        ACCESS_TOKEN: 'pk.eyJ1IjoibWRhbmlsb3YiLCJhIjoiV29JVmpxdyJ9.sBimZ4oSZYSFTdcZIgnQfQ',
        URL: 'mdanilov.j8f4ggll'
    };

    MapService._icons = {
        default:  L.divIcon({
            className: 'info',
            html: '<span class="icon glyphicon glyphicon-map-marker sp-user-marker"></span>',
            iconSize: [30, 30]
        }),
        selected: L.divIcon({
            className: 'info',
            html: '<span class="icon glyphicon glyphicon-map-marker sp-user-marker-selected"></span>',
            iconSize: [30, 30]
        }),
        locator: L.divIcon({
            className: 'info',
            html: '<span class="icon glyphicon glyphicon-map-marker sp-locator-marker"></span>',
            iconSize: [40, 40]
        })
    };

    function bindPopupWindow (marker, user) {
        var popup = L.popup({
                closeButton: false
            }).setContent([
                '<div class="sp-map-tooltip">',
                    '<span class="sp-map-tooltip-carat"></span>',
                    '<div class="sp-map-tooltip-content">',
                        '<img class="sp-map-tooltip-img" src="' + user.info.photo_50 + '">',
                        '<div class="sp-map-tooltip-info">',
                            '<h4>' + user.info.first_name + $filter('age')(user.info.bdate) + '</h4>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join('')
        );

        marker.bindPopup(popup);

        marker.on('mouseover', function () {
            marker.openPopup();
        });
        marker.on('mouseout', function () {
            if (!MapService._popupFixed) {
                marker.closePopup();
            }
        });
        marker.on('click', function () {
            marker.openPopup();
            MapService._popupFixed = true;
        });
    }

    function addMarker (user) {
        var marker = L.marker([user.location.latitude, user.location.longitude], {
            icon: MapService._icons.default,
            riseOnHover: true
        });
        marker.addTo(MapService._map);
        MapService._markers[user.mid] = marker;
        return marker;
    }

    function initializeLocator () {
        MapService._locator = L.control.locate({
            drawCircle: false,
            follow: false,
            setView: true,
            markerClass: L.marker.bind(L.marker, L.latLng(0, 0), {icon: MapService._icons.locator}),
            remainActive: true,
            keepCurrentZoomLevel: true,
            icon: 'icon glyphicon glyphicon-globe sp-locate-control',
            showPopup: false,
            strings: {
                title: "Мое текущее местоположение",
                popup: "",
                outsideMapBoundsMsg: ""
            },
            locateOptions: { watch: false }
        }).addTo(MapService._map);

        MapService._locator.locate();
    }

    MapService.init = function () {
        L.mapbox.accessToken = MapService.MAPBOX.ACCESS_TOKEN;
        MapService._map = L.mapbox.map('map-canvas', MapService.MAPBOX.URL).setView([60, 30], 10);

        GeolocationService.asyncGetCurrentPosition().then(function (position) {
            var pos = L.latLng(position.coords.latitude, position.coords.longitude);
            MapService._map.setView(pos, 15);

            // TODO: fix problem with geolocation
            //initializeLocator();
        });

        MapService._map.invalidateSize();

        // TODO: popupclose should be listening on marker
        MapService._map.on('popupclose', function () {
            MapService._popupFixed = false;
        });
    };

    MapService.setCenter = function (location) {
        var pos = L.latLng(location.latitude, location.longitude);
        MapService._map.setView(pos, 15);
    };

    MapService.invalidateSize = function () {
        MapService._map.invalidateSize();
    };

    MapService.invalidateUsers = function (users) {
        MapService.clear();
        for (var i = 0; i < users.length; i++) {
            if (users[i].location) {
                var marker = addMarker(users[i]);
                bindPopupWindow(marker, users[i]);
            }
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
