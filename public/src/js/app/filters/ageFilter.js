function AgeFilter () {
    return function (input, format) {
        input = input || '';
        var age = -1;

        if (input.length > 6) {
            var date = input.split('.');
            date = date.reverse().join('/');
            var bdate = new Date(date);
            var now = new Date();
            age = now.getFullYear() - bdate.getFullYear();
            if (now.setFullYear(1972) < bdate.setFullYear(1972)) {
                age--;
            }
        }

        if (format) {
            age = (age != -1) ? [', ', age].join('') : '';
        }

        return age;
    }
}

angular.module('spacebox')
    .filter('age', AgeFilter);
