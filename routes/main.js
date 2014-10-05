exports.getUsersWithLikes = function (request, response, next) {
    for (var i = 0; i < response.users.length; i++) {
        response.users[i].like = response.likesForUsers.indexOf(response.users[i].mid) != -1;
        response.users[i].likeMe = response.likesFromUsers.indexOf(response.users[i].mid) != -1;
    }
    response.json(response.users);
};
