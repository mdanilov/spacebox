var navigation = library(function () {
	
	var _current = 'loginPage';
	
	function open (page) {
		loadPageScripts(page);
		$('#' + page).addClass('show').removeClass('hidden');
	}
	
	function close (page) {
		$('#' + page).addClass('hidden').removeClass('show');
	}

	function generateErrorMessage (message) {
		return 'Error: ' + message;
	}

	function openError (message) {
		close(_current);
		open('errorPage');
		_current = 'errorPage';
		
		$('#errorPage').append(generateErrorMessage(message));
	}
	
	return {
		init: function () {
			open(_current);
			mediator.subscribe('error', openError);
		},

		go: function (page) {
			close(_current);
			open(page);
			_current = page;
		}
	};
	
}());