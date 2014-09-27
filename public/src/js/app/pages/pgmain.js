$(document).ready(function() {

    $('#quit-button').click(function (event) {
        vk.logout(function () {
            navigation.go('loginPage');
        });
    });
    
    $('a[href="#map"]').on('shown.bs.tab', Model.update);

    $('a[href="#users"]').on('shown.bs.tab', Model.update);
});
