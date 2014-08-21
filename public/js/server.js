var server = library(function () {
	
	var _serverUrl;
	
	function generateRequest (req) {		
		var request =
		{ 
			url: _serverUrl, 
			data: null
		};

		switch(req.type)
		{
			case 'login_vk':
				request.url = request.url + '/auth';
				request.data = 
				{
					action: 'login',
					code: req.data
				};
				break;

			case 'logout_vk':
				request.url = request.url + '/auth';
				request.data = 
				{
					action: 'logout'
				};
				break;

			case 'getUsers':
				request.url = request.url + '/user';
				request.data = req.data;
				break;

			default:
				break;
		}

		return request;
	}

	function generateResponse (request, response) {
		var res;

		switch(request.type)
		{
			case 'login_vk':
				res = response.access_token;
				break;

			default:
				res = response;
				break;
		}

		return res;
	}
	
	return {
		init: function () {
			_serverUrl = config.serverUrl;
		},

		sendRequest: function (request, response) {
			var serverRequest = generateRequest(request);
			$.ajax({
				url: serverRequest.url,
				data: serverRequest.data,
				success: function (data) {
					var ret = generateResponse(request, data);
					response(ret);
				},
				error: function () {
					mediator.publish('error', 'bad request ');
				}
			});
		}
	};
	
}());