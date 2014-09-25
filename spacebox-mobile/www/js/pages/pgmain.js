$(document).ready(function() {

    Map.invalidate();
    Model.update();
    
    // TODO: add quit button 
    $('#quit-button').click(function (event) {
        vk.logout(function () {
            navigation.go('loginPage');
        });
    });
    
    // Change view form map to list
    $('a[href="#map"]').on('shown.bs.tab', Model.update);
    $('a[href="#users"]').on('shown.bs.tab', Model.update);
});
