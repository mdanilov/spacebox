function MeetFilter () {
    return function (users, radioModel) {
        if (!users || users.length == 0) {
            return;
        }

        var data = [];
        if (radioModel == 'Like') {
            for (var i = 0; i < users.length; i++) {
                if (users[i].like) {
                    data.push(users[i]);
                }
            }
        }
        else if (radioModel == 'Liked') {
            for (i = 0; i < users.length; i++) {
                if (users[i].liked) {
                    data.push(users[i]);
                }
            }
        }
        else {
            data = users;
        }

        return data;
    }
}

angular.module('spacebox')
    .filter('meet', MeetFilter);
