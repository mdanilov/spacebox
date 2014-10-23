function MainViewController ($scope, $location, $log, VkService, GeolocationService) {
    $log.debug('Initialize main view controller...');

    this.users = [];

    SearchUsers.apply(this);

    function processNearUsers (error, data) {
        if (error) {
            $log.error('Can\'t get near users due to error: ', error);
            return;
        }

        $log.debug('Founded near users locations: ', data);
        var uids = [];
        for (var i = 0; i < data.length; i++) {
            uids.push(data[i].mid);
        }

        VkService.asyncGetUsersInfo(uids).then((function (info) {
            $log.debug('VK users info collected: ', info);
            //$scope.$apply();
        }).bind(this), function (error) {
            $log.error('Can\'t get VK users info due to error: ', error);
        })
    }

    function SearchUsers () {
        $log.debug('Try to search near users...');
        GeolocationService.getNearUsers(15000, processNearUsers.bind(this));
    }

    this.Search = function () {
        SearchUsers.apply(this);
    };
}

angular.module('spacebox')
    .controller('MainViewController',
        ['$scope', '$location', '$log', 'VkService', 'GeolocationService', MainViewController]);
