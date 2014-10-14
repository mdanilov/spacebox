function MainViewController ($scope, $location, $log, VkService, GeolocationService, MapService) {

    $log.debug('Initialize main view controller...');

    this.user = {};
    this.users = [];

    VkService.getCurrentUserInfo((function (error, info) {
        if (error) {
            return;
        }
        this.user.name = info[i].first_name;
    }).bind(this));

    MapService.init();
    SearchUsers.apply(this);

    function CreateUserList (data, info) {
        var users = [];
        for (var i = 0; i < info.length; i++) {
            users[i] = {};
            users[i].location = {
                latitude: data[i].latitude,
                longitude: data[i].longitude
            };
            users[i].distance = data[i].distance;
            users[i].like = data[i].like;
            users[i].liked = data[i].likeMe;
            users[i].bdate = info[i].bdate;
            users[i].photoUrl = info[i].photo_50;
            users[i].largePhotoUrl = info[i].photo_100;
            users[i].firstName = info[i].first_name;
            users[i].screenName = info[i].screen_name;
            users[i].uid = info[i].uid;
        }

        return users;
    }

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

        VkService.getUsersInfo(uids, (function (error, info) {
            if (error) {
                $log.error('Can\'t get VK users info due to error: ', error);
                return;
            }

            $log.debug('VK users info collected: ', info);
            this.users = CreateUserList(data, info);
            $scope.$apply();

            MapService.invalidateSize();
            MapService.invalidateUsers(this.users);
        }).bind(this))
    }

    function SearchUsers () {
        $log.debug('Try to search near users...');
        GeolocationService.getNearUsers(15000, processNearUsers.bind(this));
    }

    this.Search = function () {
        SearchUsers.apply(this);
    };

    this.Logout = function () {
        $log.debug('Logout from VK...');
        VkService.logout(function () {
            $location.path('/login');
        });
    };
}

angular.module('spacebox')
    .controller('MainViewController',
        ['$scope', '$location', '$log', 'VkService', 'GeolocationService', 'MapService', MainViewController]);
