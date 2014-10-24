function AgeFilter () {
    return function (input) {
        if (!input || input.length < 6) {
            return '';
        }

        var bdate = new Date(input);
        var today = new Date();
        var age = today.getYear() - bdate.getYear();

        return [', ', age].join('');
    }
}

angular.module('spacebox')
    .filter('age', AgeFilter);
