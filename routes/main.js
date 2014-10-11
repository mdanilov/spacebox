exports.getUsersWithLikes = function (request, response, next) {
    for (var i = 0; i < response.users.length; i++) {
        response.users[i].like = 0;
        response.users[i].likeMe = 0;
        if (response.likesForUsers.indexOf(response.users[i].mid) != -1) {
            response.users[i].like = response.likesForUsers[response.users[i].mid];
        }
        if (response.likesForUsers.indexOf(response.users[i].mid) != -1) {
            response.users[i].likeMe = response.likesFromUsers[response.users[i].mid];
        }
    }
    response.json(response.users);
};
