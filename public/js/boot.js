yepnope([
    'https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js',
    './public/js/core.js'
]);

switch(bootOptions.module) {
    case 'index':
        yepnope([
            './public/js/thirdparty/ejs_0.9_alpha_1_production.js',
            './public/js/thirdparty/jquery.feedback_me.js',
            './public/js/thirdparty/lavalamp.js',
            './public/js/user.js',
            './public/js/map.js',
            './public/js/display.js',
            './public/js/context.js',
            './public/js/index.js'
        ]);
        break;

    case 'login':
        yepnope('./public/js/login.js');
        break;

    default:
        break;
}

yepnope({
    load: ['https://vk.com/js/api/openapi.js', './public/js/auth/vkopenapi.js'],
    complete: function () {
        $(function () {
            vk.init(bootOptions.vkApiID);
        });
    }
});
