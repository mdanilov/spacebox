var server = library(function () {
	
	var _serverUrl;

	return {
		init: function () {
			_serverUrl = config.serverUrl;
		},

		sendRequest: function (request, response) {
			var url = _serverUrl + '/' + request.type;
			$.ajax({
				url: url,
				data: request.data,
				success: function (data) {
					response(data);
				},
				error: function () {
					mediator.publish('error', 'bad request');
				}
			});
		}
	};
	
}());