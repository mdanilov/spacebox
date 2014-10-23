function userListDirective () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            users: '='
        },
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
        },
        templateUrl: 'src/js/app/templates/user-list.html'
    };
}

angular.module('spacebox').directive('spUserList', userListDirective);
