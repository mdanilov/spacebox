var vk = library(function() {

    var _apiId;
    var _accessToken;

    var SCOPE = 'friends';
    var DISPLAY = { PAGE: 'page', POPUP: 'popup', MOBILE: 'mobile' };

    function initAuthWindow (url, callback) {
		// this code create VK authentication window and try to close it after user login
		var popupWindow = window.open(url);
		$(popupWindow).bind('load', function () {
			redirectHandler = function () {
		    	if (arguments.callee.popup.location.href.split('#')[0] == arguments.callee.url) {
		    		clearInterval(arguments.callee.interval);
					var code = arguments.callee.popup.location.hash.split('=')[1];
					arguments.callee.popup.close();
					callback(code);
				}
		    };
			redirectHandler.url = config.vkRedirectUrl;
			redirectHandler.cb = callback;
			redirectHandler.popup = popupWindow;
			redirectHandler.interval = window.setInterval(redirectHandler, 1000);
		});
    }

    return {

        init: function () {
            _apiId = config.vkApiId;
        },

        login: function (callback) {
            var authUrl = 'https://oauth.vk.com/authorize?' +
                'client_id=' + _apiId + '&scope=' + SCOPE +
                '&redirect_uri=' + config.vkRedirectUrl +
                '&display=' + DISPLAY.POPUP + '&response_type=' + 'code';

			initAuthWindow(authUrl, function (code) {
				server.sendRequest({ type: 'login', data: {code: code} },
				function (response) {
					_accessToken = response.access_token;
					callback();
				});
			});
        },

        logout: function (callback) {
        	server.sendRequest({ type: 'logout' }, callback);
        },

        call: function (method, options, callback) {
			var url = 'https://api.vk.com/method/' + method;
			var data = options;
			data.access_token = _accessToken;
			data.user_ids = options.user_ids.join(',')

			$.ajax({
				url: url,
				data: data,
				success: callback,
				error: function () {
					mediator.publish('error', 'vk method call error');
				},
				dataType: "json"
			});
        }
    }
	
}());
