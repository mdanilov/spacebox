var UserList = library(function () {

    var ELEMENT = '#list-users';

    function getHtmlElement (info) {
        return new EJS({url: './templates/wildcard.ejs'}).render({
            photo_url: info.photo_50,
            first_name: info.first_name,
            screen_name: info.screen_name
        });
    }

    function invalidateUsers (users) {
        $(ELEMENT).empty();

        if (users.length != 0)
        {
            for (var i = 0; i < users.length; i++)
            {
                var innerHtml = getHtmlElement(users[i].info);
                $(ELEMENT).append(innerHtml);
            }
        }
        else 
        {
            $(ELEMENT).append('<div> К сожалению никто не найден</div>');
        }
    }

    return {

        init: function () {
            mediator.subscribe('usersChange', invalidateUsers);
        }
    };

}());
