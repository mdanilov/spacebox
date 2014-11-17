function AgeFilter () {
    return function (input, format) {
        input = input || '';
        var age = -1;

        if (input.length > 6) {
            var date = input.split('.');
            date = date.reverse().join('/');
            var bdate = new Date(date);
            var today = new Date();
            age = today.getYear() - bdate.getYear();
        }

        if (format) {
            age = (age != -1) ? [', ', age].join('') : '';
        }

        return age;
    }
}

angular.module('spacebox')
    .filter('age', AgeFilter);
