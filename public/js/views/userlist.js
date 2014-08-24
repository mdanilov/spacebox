var UserList = library(function () {

    var ELEMENT = '#list-users';

    function getHtmlElement (info, liked) {
        return new EJS({url: './templates/wildcard.ejs'}).render({
            photo_url: info.photo_50,
            first_name: info.first_name,
            screen_name: info.screen_name,
            uid: info.uid,
            text: liked ? 'Dislike' : 'Like'
        });
    }

    function likeHandler () {
        var userId = $(this).attr('href').substring(1);
        if ($(this).text() === 'Like') {
            $(this).text('Dislike');
            server.sendRequest({ type: 'like', data: { id: userId} }, null);
        }
        else {
            $(this).text('Like');
            server.sendRequest({ type: 'dislike', data: { id: userId} }, null);
        }
    }

    function invalidateUsers (users) {
        $(ELEMENT).empty();

        if (users.length != 0) {
            for (var i = 0; i < users.length; i++) {
                var innerHtml = getHtmlElement(users[i].info, users[i].liked);
                $(ELEMENT).append(innerHtml);
            }
            // TODO: low performance of dynamic event handler
            $('.like-link').on("click", likeHandler);
        }
        else {
            $(ELEMENT).append('<div> К сожалению никто не найден</div>');
        }
    }

    return {
        init: function () {
            mediator.subscribe('usersChange', invalidateUsers);
        }
    };

}());
