function MapService ($log, $filter, $timeout, ConfigService, GeolocationService) {

    var MapService = {};

    MapService._markers = {};
    MapService._selected = undefined;
    MapService._map = {};
    MapService._locator = {};
    MapService._popupFixed = false;
    MapService.MAPBOX = {
        ACCESS_TOKEN: 'pk.eyJ1IjoibWRhbmlsb3YiLCJhIjoiV29JVmpxdyJ9.sBimZ4oSZYSFTdcZIgnQfQ',
        URL: 'mdanilov.j8f4ggll'
    };

    MapService.MARKER_ICONS = {
        MALE:  L.divIcon({
            className: 'info',
            html: '<span class="fontawesome-map-marker male"></span>',
            iconSize: [30, 30]
        }),
        FEMALE:  L.divIcon({
            className: 'info',
            html: '<span class="fontawesome-map-marker female"></span>',
            iconSize: [30, 30]
        }),
        SELECTED: L.divIcon({
            className: 'info',
            html: '<span class="fontawesome-map-marker selected"></span>',
            iconSize: [40, 40]
        }),
        LOCATOR: L.divIcon({
            className: 'info',
            html: '<div class="locator"></div>',
            iconSize: [18, 18]
        })
    };

    function bindPopupWindow (marker, user) {
        var popup = L.popup({
                closeButton: false
            }).setContent([
                '<div class="sp-map-tooltip">',
                    '<span class="sp-map-tooltip-carat"></span>',
                    '<div class="sp-map-tooltip-content">',
                        '<div class="sp-map-tooltip-info">',
                            '<h4>' + user.info.first_name + $filter('age')(user.info.bdate, true) + '</h4>',
                        '</div>',
                        '<img class="img-thumbnail" src="' + user.info.photo_100 + '">',
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
        var icon = MapService.MARKER_ICONS.MALE;
        if (user.info.sex == 1) {
            icon = MapService.MARKER_ICONS.FEMALE;
        }
        var marker = L.marker([user.location.latitude, user.location.longitude], {
            icon: icon,
            riseOnHover: true
        });
        marker.addTo(MapService._map);
        MapService._markers[user.mid] = marker;
        MapService._markers[user.mid].sex = user.info.sex;
        return marker;
    }

    function initializeLocator () {
        MapService._locator = L.control.locate({
            drawCircle: false,
            follow: false,
            remainActive: true,
            markerClass: L.marker.bind(L.marker, L.latLng(0, 0), {icon: MapService.MARKER_ICONS.LOCATOR}),
            icon: 'fa fa-location-arrow',
            setView: true,
            keepCurrentZoomLevel: true,
            showPopup: false,
            strings: {
                title: "Мое текущее местоположение",
                popup: "",
                outsideMapBoundsMsg: ""
            },
            locateOptions: {
                watch: false
            }
        }).addTo(MapService._map);

        // TODO: this is workaround to show locator marker immediately
        $timeout(MapService._locator.locate, 1000);
        $timeout(MapService._locator.locate, 2000);
    }

    MapService.invalidateSize = function () {
        MapService._map.invalidateSize();
    };

    MapService.init = function () {
        L.mapbox.accessToken = MapService.MAPBOX.ACCESS_TOKEN;
        var options = ConfigService.getMapOptions();
        MapService._map = L.mapbox.map('map-canvas', MapService.MAPBOX.URL).setView([60, 30], options.zoom);

        GeolocationService.asyncGetCurrentPosition().then(function (position) {
            var pos = L.latLng(position.coords.latitude, position.coords.longitude);
            MapService._map.setView(pos);

            initializeLocator();
        });

        MapService._map.invalidateSize();

        // TODO: popupclose should be listening on marker
        MapService._map.on('popupclose', function () {
            MapService._popupFixed = false;
        });
    };

    MapService.setCenter = function (location) {
        if (angular.isNumber(location.latitude) &&
            angular.isNumber(location.longitude)) {
            var pos = L.latLng(location.latitude, location.longitude);
            MapService._map.setView(pos);
        }
    };

    function selectMarker (id) {
        var selected = MapService._selected;
        if (angular.isDefined(selected) && selected != id &&
            angular.isDefined(MapService._markers[selected])) {
            if (MapService._markers[selected].sex == 1) {
                MapService._markers[selected].setIcon(MapService.MARKER_ICONS.FEMALE);
            }
            else {
                MapService._markers[selected].setIcon(MapService.MARKER_ICONS.MALE);
            }
            MapService._selected = undefined;
        }

        if (angular.isDefined(MapService._markers[id])) {
            MapService._selected = id;
            MapService._markers[id].setIcon(MapService.MARKER_ICONS.SELECTED);
            MapService._markers[id].openPopup();
            MapService._popupFixed = true;
        }
    }

    MapService.selectUser = function (user) {
        if (angular.isObject(user) &&
            user.mid && angular.isObject(user.location)) {
            selectMarker(user.mid);
            MapService.setCenter(user.location);
        }
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
        MapService._selected = undefined;
    };

    return MapService;
}

angular.module('spacebox').factory('MapService',
    ['$log', '$filter', '$timeout', 'ConfigService', 'GeolocationService', MapService]);
