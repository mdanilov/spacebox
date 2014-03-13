var vk = library(function() {

    this.apiID;
    this.access_token;

    return {
        init: function (apiID, access_token) {
            this.apiID = apiID;
            this.access_token = access_token;
        },
        login: function (settings) {
            var authRedirectUrl = 'https://oauth.vk.com/authorize?' +
                'client_id=' + this.apiId +
                '&scope=' + settings.scope +
                '&redirect_uri=' + settings.redirectUrl +
                '&display=popup&response_type=code';
            window.location.href = authRedirectUrl;
        },
        logout: function () {
            $.get('/logout')
            .success(function (data) {
                window.location.replace(data);
            });
        },
        call: function (method, options, cb) {
        }
    }

}());
