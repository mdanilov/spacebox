var vk = library(function() {

    var _apiId;
    var _accessToken;

    var SCOPE = 'friends';
    var DISPLAY = { PAGE: 'page', POPUP: 'popup', MOBILE: 'mobile' };

    function initAuthWindow (url, callback) {
		// this code create VK authentication window and try to close it after user login
		var popupWindow = window.open(url, '_blank', 'location=no');

		var eventHandler = function (event) {
			if (event.url.split('#')[0] == config.vkRedirectUrl) {
				//window.alert('in event handler');
				var code = event.url.split('#')[1].split('=')[1];
				callback(code);
				popupWindow.close();
			}
  		};
  		
		popupWindow.addEventListener('loadstop', eventHandler); 
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
