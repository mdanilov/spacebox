function mapDirective ($compile, $rootScope, $timeout, ConfigService, LocationService) {
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
                USER:  L.divIcon({
                    className: 'info',
                    html: '<i class="fa fa-map-marker user"></i>',
                    iconSize: [30, 30]
                }),
                SELECTED: L.divIcon({
                    className: 'info',
                    html: '<i class="fa fa-map-marker selected"></i>',
                    iconSize: [40, 40]
                }),
                LOCATOR: L.divIcon({
                    className: 'info',
                    html: '<div class="locator"></div>',
                    iconSize: [18, 18]
                })
            };

            function Locator () {
                var locator = L.control.locate({
                    drawCircle: false,
                    follow: false,
                    remainActive: true,
                    markerClass: L.marker.bind(L.marker, L.latLng(0, 0), {icon: MARKER_ICONS.LOCATOR}),
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
                }).addTo(map);

                // TODO: this is workaround to show locator marker immediately
                $timeout(locator.locate, 1000);
                $timeout(locator.locate, 2000);

                return locator;
            }

            L.mapbox.accessToken = ConfigService.MAPBOX.ACCESS_TOKEN;
            var options = ConfigService.getMapOptions();

            var map = L.mapbox.map('map-canvas', ConfigService.MAPBOX.URL).setView([60, 30], options.zoom);
            map.invalidateSize();
            // TODO: popupclose should be listening on marker
            map.on('popupclose', function () {
                popupFixed = false;
            });

            LocationService.asyncGetCurrentPosition().then(function (position) {
                var coords = position.coords;
                map.setView(L.latLng(coords.latitude, coords.longitude));
                scope.locator = Locator();
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
                                    '<i class="fa fa-comments"></i></a>',
                                '<a ng-href="http://www.vk.com/id{{user.info.id}}" target="_blank">',
                                    '<i class="fa fa-vk"></i></a>',
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

            function toggleMarker (user) {
                if (angular.isDefined(scope.markers.active) && scope.markers.active != user.mid &&
                    angular.isDefined(scope.markers[scope.markers.active])) {
                    scope.markers[scope.markers.active].setIcon(MARKER_ICONS.USER);
                    delete scope.markers.active;
                }

                if (angular.isDefined(scope.markers[user.mid])) {
                    scope.markers.active = user.mid;
                    scope.markers[scope.markers.active].setIcon(MARKER_ICONS.SELECTED);
                    scope.markers[scope.markers.active].openPopup();
                    popupFixed = true;
                }
            }

            function addMarker (user) {
                var marker = L.marker([user.location.latitude, user.location.longitude], {
                    icon: MARKER_ICONS.USER,
                    riseOnHover: true
                });
                marker.addTo(map);
                scope.markers[user.mid] = marker;
                return marker;

            }

            scope.$watch('users', function (users) {
                if (angular.isArray(users)) {
                    clear();
                    for (var i = 0; i < users.length; i++) {
                        if (users[i].hasLocation()) {
                            var marker = addMarker(users[i]);
                            bindPopupWindow(marker, users[i]);
                        }
                    }
                }
            });

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
    ['$compile', '$rootScope', '$timeout', 'ConfigService', 'LocationService', mapDirective]);