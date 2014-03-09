$(document).ready(function() {

    var context = new Context();
    var display = new Display(context);

    $('#search').click(function(event) {
        event.preventDefault();
        context.update(display.render);
    });

    $('#vk-logout').click(function(event) {
        event.preventDefault();
        VK.Auth.logout();
        $.get('/logout').success(function (data) {
            window.location.replace(window.location);
        });
    });
});
