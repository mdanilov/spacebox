exports.getUsersWithLikes = function (request, response, next) {
    for (var i = 0; i < response.users.length; i++) {
        var id = parseInt(response.users[i].mid);
        response.users[i].like = response.likesForUsers[id] ? response.likesForUsers[id] : 0;
        response.users[i].likeMe = response.likesFromUsers[id] ? response.likesFromUsers[id] : 0;
    }
    response.json(response.users);
};
