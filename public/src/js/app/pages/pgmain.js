$(document).ready(function() {

    Map.invalidate();
    Model.update();
    
    $('#quit-button').click(function (event) {
        vk.logout(function () {
            navigation.go('loginPage');
        });
    });
    
    $('a[href="#map"]').on('shown.bs.tab', function () {
        Map.invalidate();
        Model.update();
    });

    $('a[href="#users"]').on('shown.bs.tab', Model.update);
});
