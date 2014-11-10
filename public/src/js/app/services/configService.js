angular.module('spacebox').value('ConfigService', {
    vkApiId: 4213835,
    isLogin: false,
    searchOptions: {
        radius: 15000,
        sex: 0,
        ageInterval: {
            top: 99,
            bottom: 18
        }
    },
    maxPhoto: 6
});
