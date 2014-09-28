//var UserList = library(function () {
//
//    function likeHandler () {
//        var userId = $(this).attr('href').substring(1);
//        if ($(this).text() === 'Like') {
//            $(this).text('Dislike');
//            server.sendRequest({ type: 'like', data: { id: userId} }, null);
//        }
//        else {
//            $(this).text('Like');
//            server.sendRequest({ type: 'dislike', data: { id: userId} }, null);
//        }
//    }
//
//    function invalidateUsers (users) {
//        $(ELEMENT).empty();
//
//        if (users.length != 0) {
//            for (var i = 0; i < users.length; i++) {
//                var innerHtml = getHtmlElement(users[i].info, users[i].like);
//                $(ELEMENT).append(innerHtml);
//            }
//            // TODO: low performance of dynamic event handler
//            $('.like-link').on("click", likeHandler);
//        }
//        else {
//            $(ELEMENT).append('<div> К сожалению никто не найден</div>');
//        }
//    }
//
//}());
