function friendListDirective ($log, MessagesService) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            users: '=',
            selected: '=',
            onMarkerClick: '=',
            chat: '&onChat'
        },
        templateUrl: 'src/js/app/templates/friend-list.html',
        controller: function ($scope) {
            var cards = $scope.cards = [];

            this.select = function (card) {
                angular.forEach(cards, function(card) {
                    card.selected = false;
                });
                card.selected = true;
                $scope.selected = card.user;
            };

            this.addCard = function (card) {
                cards.push(card);
            };
        }
    };
}

angular.module('spacebox').directive('spFriendList',
    ['$log', 'MessagesService', friendListDirective]);
