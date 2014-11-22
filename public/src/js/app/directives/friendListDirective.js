function friendListDirective () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            users: '=',
            onMarkerClick: '='
        },
        templateUrl: 'src/js/app/templates/friend-list.html',
        controller: function ($scope) {
            var cards = $scope.cards = [];

            this.select = function (card) {
                angular.forEach(cards, function(card) {
                    card.selected = false;
                });
                card.selected = true;
            };

            this.addCard = function (card) {
                cards.push(card);
            };
        }
    };
}

angular.module('spacebox').directive('spFriendList', friendListDirective);
