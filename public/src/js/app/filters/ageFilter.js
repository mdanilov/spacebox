function AgeFilter () {
    return function (input) {
        if (!input || input.length < 6) {
            return '';
        }

        var date = input.split('.');
        date = [date[1], date[0], date[2]].join('.');
        var bdate = new Date(date);
        var today = new Date();
        var age = today.getYear() - bdate.getYear();

        return [', ', age].join('');
    }
}

angular.module('spacebox')
    .filter('age', AgeFilter);
