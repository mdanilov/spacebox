var LocateControl = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div',
            'leaflet-control-locate leaflet-bar leaflet-control');

        var self = this;

        var LOCATOR_ICON = {
            html: [
                '<div>',
                '<div class="sp-locator-circle sp-pulse"></div>',
                '<div class="sp-locator"></div>',
                '</div>'
            ].join(''),
            iconSize: [18, 18]
        };

        self._link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', container);
        self._link.href = '';
        L.DomUtil.create('i', 'fa fa-location-arrow', self._link);

        onLocationFound(null, map.scope.position);
        map.scope.$on('location.found', onLocationFound);

        L.DomEvent.on(self._link, 'click', function (event) {
            event.stopPropagation();
            event.preventDefault();
            map.setView(getLatLng(self._position));
        });

        function onLocationFound (event, position) {
            if (!angular.isObject(position)) {
                return;
            }

            if (!self._marker) {
                self._marker = L.marker(getLatLng(position), {
                    icon: L.divIcon(LOCATOR_ICON)
                });
                self._marker.addTo(map);
            } else {
                self._marker.setLatLng(getLatLng(position));
            }
            self._position = position;
        }

        return container;
    }
});

function getLatLng (position) {
    return new L.LatLng(position.latitude, position.longitude);
}

function mapDirective ($compile, $rootScope, $timeout, $animate, ConfigService, LocationService) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            users: '=',
            selected: '='
        },
        template: '<div id="map-canvas"></div>',
        link: function (scope, element, attrs) {
            scope.markers = {};

            var MARKER_ICONS = {
                USER:  {
                    html: '<i class="fa fa-map-marker sp-marker-user"></i>',
                    iconSize: [30, 30]
                },
                SELECTED: {
                    html: '<i class="fa fa-map-marker sp-marker-user sp-selected"></i>',
                    iconSize: [40, 40]
                }
            };

            L.mapbox.accessToken = ConfigService.MAPBOX.ACCESS_TOKEN;
            var options = ConfigService.getMapOptions();

            var map = L.mapbox.map('map-canvas', ConfigService.MAPBOX.URL).setView([60, 30], options.zoom);
            map.scope = scope;
            map.invalidateSize();
            // TODO: popupclose should be listening on marker
            map.on('popupclose', function () {
                popupFixed = false;
            });

            LocationService.getCurrentPosition().then(function (position) {
                scope.position = position;
                map.setView(getLatLng(position));
                map.addControl(new LocateControl());
            });

            var popupFixed = false;
            function bindPopupWindow (marker, user) {
                var html = [
                    '<div class="sp-map-tooltip">',
                        '<span class="sp-map-tooltip-carat"></span>',
                        '<div class="sp-map-tooltip-content">',
                            '<img class="img-rounded" ng-src="{{user.info.photo_100}}">',
                            '<div class="sp-map-tooltip-info">',
                                '<h4>{{user.info.first_name}}{{user.info.bdate|age:true}}</h4>',
                                '<p>{{user.info.sex == 1 ? \'Была \' : \'Был \' }}<span am-time-ago="user.location.timestamp"></span></p>',
                                '<a href="" ng-click="openChat(user)">',
                                    '<i class="fa fa-comments"></i>Сообщение</a>',
                            '</div>',
                        '</div>',
                        '<div class="sp-map-tooltip-status">',
                            '<p ng-if="user.status">{{user.status}}</p>',
                            '<p ng-if="!user.status">Нет статуса</p>',
                        '</div>',
                    '</div>'
                ].join('');

                var link = $compile(angular.element(html));
                var newScope = $rootScope.$new();
                newScope.user = user;
                newScope.openChat = function (user) {
                    $rootScope.$broadcast('chat.open', user);
                };

                var popup = L.popup({ closeButton: false }).setContent(link(newScope)[0]);
                marker.bindPopup(popup);

                marker.on('mouseover', function () {
                    marker.openPopup();
                });
                marker.on('mouseout', function () {
                    if (!popupFixed) {
                        marker.closePopup();
                    }
                });
                marker.on('click', function () {
                    marker.openPopup();
                    scope.$apply(function () {
                        scope.selected = user;
                    });
                    popupFixed = true;
                });
            }

            function createMarkerIcon (user, selected) {
                var icon = selected ? MARKER_ICONS.SELECTED : MARKER_ICONS.USER;
                if (user.isOnline()) {
                    icon.className = 'sp-online';
                }
                return L.divIcon(icon);
            }

            function toggleMarker (user) {
                var active = scope.markers.active;
                if (angular.isDefined(active) && active != user.mid &&
                    angular.isDefined(scope.markers[active])) {
                    scope.markers[active].setIcon(createMarkerIcon(user, false));
                    scope.markers[active].closePopup();
                    delete scope.markers.active;
                    popupFixed = false;
                }

                if (angular.isDefined(scope.markers[user.mid])) {
                    active = scope.markers.active = user.mid;
                    scope.markers[active].setIcon(createMarkerIcon(user, true));
                    scope.markers[active].openPopup();
                    popupFixed = true;
                }
            }

            function addMarker (user) {
                var marker = L.marker([user.location.latitude, user.location.longitude], {
                    icon: createMarkerIcon(user, false),
                    riseOnHover: true,
                    zIndexOffset: 1000
                });
                marker.addTo(map);

                scope.markers[user.mid] = marker;
                return marker;
            }

            function invalidateUsers (users) {
                if (angular.isArray(users)) {
                    clear();
                    for (var i = 0; i < users.length; i++) {
                        if (users[i].hasLocation()) {
                            var marker = addMarker(users[i]);
                            bindPopupWindow(marker, users[i]);
                        }
                    }
                }
            }

            invalidateUsers();
            scope.$watchCollection('users', invalidateUsers);

            scope.$watch('selected', function (user) {
                if (angular.isObject(user)) {
                    toggleMarker(user);
                    if (user.hasLocation()) {
                        var location = user.location;
                        map.setView(L.latLng(location.latitude, location.longitude));
                    }
                }
            });

            function clear () {
                for (var key in scope.markers) {
                    if (!scope.markers.hasOwnProperty(key)) continue;
                    map.removeLayer(scope.markers[key]);
                    delete scope.markers[key];
                }
                delete scope.markers.active;
            }
        }
    };
}

angular.module('spacebox').directive('spMap',
    ['$compile', '$rootScope', '$timeout', '$animate', 'ConfigService', 'LocationService', mapDirective]);