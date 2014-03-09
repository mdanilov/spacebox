function Display(context) {

    function renderUsersList(users) {
        $('#list-users').empty();
        if (users.length != 0) {
            for (var i = 0; i < users.length; i++) {
                $('#list-users').append(users[i].getHtmlElement());
            }
        }
        else {
            $('#list-users').append('<div> К сожалению никто не найден</div>');
        }
    }

    function renderMap(users) {
        Map.deleteAllMarkers();
        for (var i = 0; i < users.length; i++) {
            Map.addMarker(users[i].getLocation(), users[i])
        }
    }

    this.render = function() {
        var users = context.getUsers();
        renderUsersList(users);
        renderMap(users);
    }
}
