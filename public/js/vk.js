var vk = library(function() {

    var SCOPE = 'friends';

    return {
        init: function () {
            VK.init({ apiId: config.vkApiId });
        },

        login: function (callback) {
            VK.Auth.login(function (response) {
                if (response.session) {
                    server.sendRequest({ type: 'login_vk', data: response.session }, callback);
                }
                else {
                    mediator.publish('error', 'vk error');
                }
            }, VK.access[SCOPE]);
        },

        logout: function () {
            VK.Auth.logout();
            server.sendRequest({ type: 'logout_vk' }, callback);
        },

        call: function (method, options, callback) {
            VK.Api.call(method, options, callback);
        }
    };

}());
