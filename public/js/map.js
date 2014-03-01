var Map = (function() {

    var _markersArray = [];
    var _map;

    function handleNoGeolocation(errorFlag) {
        if (errorFlag) {
            var content = 'Error: The Geolocation service failed.';
        } else {
            var content = 'Error: Your browser doesn\'t support geolocation.';
        }

        var options = {
            map: _map,
            position: new google.maps.LatLng(60, 105),
            content: content
        };

        var infowindow = new google.maps.InfoWindow(options);
        _map.setCenter(options.position);
    }

    return {
        initialize: function () {
            var mapOptions = {
                zoom: 15
            };

            _map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

            // Try HTML5 geolocation
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = new google.maps.LatLng(position.coords.latitude,
                                                     position.coords.longitude);

                    _map.setCenter(pos);
                }, function () {
                    handleNoGeolocation(true);
                });
            }
            else {
                // Browser doesn't support Geolocation
                handleNoGeolocation(false);
            }
        },
        addMarker: function (options) {
            var pos = new google.maps.LatLng(options.latitude, options.longitude);

            var infowindow = new google.maps.InfoWindow({
                map: _map,
                position: pos,
                content: options.user_id.toString()
            })

            _markersArray.push(infowindow);
        },
        deleteAllMarkers: function () {
            if (_markersArray) {
                for (var i in _markersArray) {
                    if (_markersArray[i] !== null) {
                        google.maps.event.clearInstanceListeners(_markersArray[i]);
                        _markersArray[i].close();
                        _markersArray[i] = null;
                    }
                }
                _markersArray.length = 0;
            }
        }
    };

})();

google.maps.event.addDomListener(window, 'load', Map.initialize);
