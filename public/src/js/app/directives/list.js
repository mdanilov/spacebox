function friendListDirective () {
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
                cards.selected = card.user.mid;
                $scope.selected = card.user;
            };

            this.addCard = function (card) {
                card.selected = false;
                cards.push(card);
            };

            $scope.$watch('selected', function (user) {
                if (angular.isObject(user) && cards.selected != user.mid) {
                    angular.forEach(cards, function (card) {
                        if (card.user.mid == user.mid) {
                            card.selected = true;
                            cards.selected = card.user.mid;
                            card.scrollTo();
                        }
                        else {
                            card.selected = false;
                        }
                    });
                }
            });
        }
    };
}

angular.module('spacebox').directive('spFriendList',
    [friendListDirective]);
