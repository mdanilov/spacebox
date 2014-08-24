exports.getUsersWithLikes = function (request, response, next) {
    if ((response.likesForUsers.length != 0) || (response.likesFromUsers.length != 0)) {
        for (var i = 0; i < response.users.length; i++) {
            response.users[i].like = response.likesForUsers.indexOf(response.users[i].mid) != -1;
            response.users[i].likeMe = response.likesFromUsers.indexOf(response.users[i].mid) != -1;
        }
    }
    response.json(response.users);
};
