var vk = library(function() {

    var SCOPE = 'friends';

    return {
        init: function () {
            VK.init({ apiId: config.vkApiId });
        },

        login: function (callback) {
            VK.Auth.login(function (response) {
                if (response.session) {
                    server.sendRequest({ type: 'login', data: response.session }, callback);
                }
                else {
                    mediator.publish('error', 'vk error');
                }
            }, VK.access[SCOPE]);
        },

        logout: function (callback) {
            server.sendRequest({ type: 'logout' }, function () {
                VK.Auth.logout();
                callback();
            });
        },

        call: function (method, options, callback) {
            VK.Api.call(method, options, callback);
        }
    };

}());
