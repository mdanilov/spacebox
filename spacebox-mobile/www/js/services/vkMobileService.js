function VkMobileService ($http, $log) {

	var VkMobileService = {};

	VkMobileService._mid = 0;
    VkMobileService._apiId = config.vkApiId;
    VkMobileService._accessToken = 0;

    VkMobileService.SCOPE = 'friends';
    VkMobileService.DISPLAY = { PAGE: 'page', POPUP: 'popup', MOBILE: 'mobile' };

    function initAuthWindow (url, callback) {
		// this code create VK authentication window and try to close it after user login
		var popupWindow = window.open(url, '_blank', 'location=no');

		var eventHandler = function (event) {
			if (event.url.split('#')[0] == config.vkRedirectUrl) {
				var code = event.url.split('#')[1].split('=')[1];
				callback(code);
				popupWindow.close();
			}
  		};
  		
		popupWindow.addEventListener('loadstop', eventHandler); 
    }

    VkMobileService.login = function (callback) {
        var authUrl = 'https://oauth.vk.com/authorize?' +
            'client_id=' + VkMobileService._apiId + '&scope=' + VkMobileService.SCOPE +
            '&redirect_uri=' + config.vkRedirectUrl +
            '&display=' + VkMobileService.DISPLAY.POPUP + '&response_type=' + 'code';

		initAuthWindow(authUrl, function (code) {	
        	$http.get(config.serverUrl + '/login', {params: {code: code}}).
	            success(function (data, status, headers, config) {
	            	$log.debug('VK user with access_token%s has been authorized', data.access_token);
	            	VkMobileService._accessToken = data.access_token;    
	                callback(null);
	            }).
	            error(function (data, status, headers, config) {
                	$log.error('Can\'t authorized VK user');
	                callback(status);
	            });
		});
    };

    VkMobileService.logout = function (callback) {
    	$http.get(config.serverUrl + '/logout').
            success(function (data, status, headers, config) {
            	 callback(null);
            }).
            error(function (data, status, headers, config) {
            	$log.error('VK logout error');
                callback(status);
            });
    };

    VkMobileService.getUsersInfo = function (ids, callback) {
    	//TODO
    };

    VkMobileService.call = function (method, options, callback) {
		var url = 'https://api.vk.com/method/' + method;
		var data = options;
		data.access_token = VkMobileService._accessToken;
		data.user_ids = options.user_ids.join(',')

		$http.get(url, {params: data, responseType: "json"}).
            success(function (data, status, headers, config) {
                callback(null);
            }).
            error(function (data, status, headers, config) {
            	$log.error('Can\'t get VK users information');
                callback(status);
            });
    };

    VkMobileService.getLoginStatus = function (callback) {
        $http.get(config.serverUrl + '/getLoginStatus').
            success(function (data, status, headers, config) {
            	VkMobileService._mid = data.mid;
              	VkMobileService._accessToken = data.access_token;
                callback(null);
            }).
            error(function (data, status, headers, config) {
                $log.error('GetLoginStatus error!');
                callback(status);
            });
    };

    return VkMobileService;
}

angular.module('spacebox-mobile')
    .factory('VkMobileService', ['$http', '$log', VkMobileService]);