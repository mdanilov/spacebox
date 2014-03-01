$(document).ready(function() {

    $('#search').click(function(event) {
        event.preventDefault();
        context.update();
    });

    $('#vk-logout').click(function(event) {
        event.preventDefault();
        VK.Auth.logout();
        $.get('/logout').success(function (data) {
            window.location.replace(window.location);
        });
    });
});
