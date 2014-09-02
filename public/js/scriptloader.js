yepnope([
    './js/thirdparty/jquery-2.1.1.min.js',
    './js/utils.js',
    './js/server.js',
    './js/navigation.js'
]);

yepnope({
    test: isMobile,
    yep: './js/thirdparty/cordova.js'
});

function loadPageScripts (page) {
	switch(page) {
		case 'mainPage':
			yepnope([
				'./js/thirdparty/ejs_0.9_alpha_1_production.js',
				'./js/thirdparty/mapbox.js',
				'./js/views/userlist.js',
				'./js/views/navbar.js',
				'./js/views/map.js',
				'./js/model.js',
				'./js/pages/pgmain.js'
			]);
			break;
		case 'loginPage':
            loadLoginPage();
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
