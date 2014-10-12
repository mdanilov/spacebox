function AgeFilter () {
    return function (input) {
        if (!input || input.length < 6) {
            return 'Возраст скрыт';
        }

        var bdate = new Date(input);
        var today = new Date();
        var age = today.getYear() - bdate.getYear();

        // if (((age % 10) > 4) || ((age % 10) == 0)) {
        //     return age + ' лет';
        // } else if ((age % 10) == 1){
        //     return age + ' год';
        // }
        // else {
        //     return age + ' года';
        // }
        return age;
    }
}

angular.module('spacebox')
    .filter('age', AgeFilter);
