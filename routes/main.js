exports.getUsersWithLikes = function (request, response, next) {
    if (response.likes.length != 0) {
        for (var i = 0; i < response.users.length; i++) {
            response.users[i].liked = response.likes.indexOf(response.users[i].mid) != -1;
        }
    }
    response.json(response.users);
};
