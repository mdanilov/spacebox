var login = library(function () {

    return {
        init: function () {
            $('#vk-login').click(function (event) {
                event.preventDefault();
                vk.login('FRIENDS');
            });
        }
    }

}());
