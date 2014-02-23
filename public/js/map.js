﻿var markersArray = [];

// Deletes all markers in the array by removing references to them
function deleteOverlays() {
    if (markersArray) {
        for (i in markersArray) {
            if (markersArray[i] !== null) {
                google.maps.event.clearInstanceListeners(markersArray[i]);
                markersArray[i].close();
                markersArray[i] = null;
            }
        }
        markersArray.length = 0;
    }
}

function refreshMapMarkers(users) {
    deleteOverlays();

    for (var i in users) {
        var pos = new google.maps.LatLng(users[i].latitude, users[i].longitude);

        var infowindow = new google.maps.InfoWindow({
            map: map,
            position: pos,
            content: users[i].user_id.toString()
        })

        markersArray.push(infowindow);
    }
}

function initialize() {
    var mapOptions = {
        zoom: 15
    };
    
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                                             position.coords.longitude);

            map.setCenter(pos);
        }, function() {
            handleNoGeolocation(true);
        });
    }
    else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }
}

function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}

google.maps.event.addDomListener(window, 'load', initialize);
