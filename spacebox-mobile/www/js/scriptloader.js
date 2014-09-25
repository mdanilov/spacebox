yepnope([
    './js/thirdparty/jquery-2.1.1.min.js',
    './js/utils.js',
    './js/server.js'
    //'./js/navigation.js'
]);

// yepnope({
//     test: isMobile,
//     yep: './js/thirdparty/cordova.js'
// });

function loadPageScripts (page, callback) {
	switch(page) {
		case 'mainPage':
			yepnope({ 
				load: [
				//'./js/thirdparty/ejs_0.9_alpha_1_production.js',
				'./js/thirdparty/mapbox.js',
				//'./js/views/navbar.js',
				'./js/views/map.js',
				'./js/model.js'
				//'./js/pages/pgmain.js'
				],
				complete: callback
			});
			break;
		case 'loginPage':
            loadLoginPage();
			break;
		case 'listPage':
			yepnope({ 
				load: [
				//'./js/thirdparty/ejs_0.9_alpha_1_production.js',
				'./js/views/userlist.js'
				],
				complete: callback
			});
			break;
		default:
			break;
	}
}

function loadLoginPage() {
    yepnope({
        test: isMobile,
        yep: './js/mobile/vk.js',
        nope: ['./js/thirdparty/openapi.js', './js/vk.js']
    });
}
