var vk = (function() {

    return {
        init: function (apiID) {
            VK.init({ apiId: apiID });
        },
        login: function (settings) {
            VK.Auth.login(function (response) {
                if (response.session) {
                    $.get('/auth?login', {
                        session: response.session
                        })
                    .success(function (data) {
                        window.location.replace(data);
                    });
                }
            }, VK.access[settings]);
        },
        logout: function () {
            VK.Auth.logout();
            $.get('/auth?logout')
            .success(function (data) {
                window.location.replace(data);
            });
        },
        call: function (method, options, cb) {
            VK.Api.call(method, options, cb);
        }
    };

})();
