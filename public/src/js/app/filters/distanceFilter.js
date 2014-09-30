function DistanceFilter () {
    return function (input) {
        if (input >= 1000) {
            return (input/1000).toFixed(1) + ' км';
        } else {
            return input.toFixed(0) + ' м';
        }
    }
}

angular.module('spacebox')
    .filter('distance', DistanceFilter);
