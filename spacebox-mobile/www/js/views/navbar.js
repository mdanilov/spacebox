var Navbar = library(function () {

    var ELEMENT = '#userlist-nav';

    function invalidateUsers (users) {
        var badge = $(ELEMENT).find('.badge');
        if (users.length != 0) {
            if (badge.length != 0) {
                badge.empty();
                badge.append(users.length);
            }
            else {
                var innerHtml = '<span class="badge">' + users.length + '</span>';
                $(ELEMENT).append(innerHtml);
            }
        }
        else
        {
            if (badge.length != 0) {
                badge.remove();
            }
        }
    }

    return {

        init: function () {
            mediator.subscribe('usersChange', invalidateUsers);
        }
    };

}());
