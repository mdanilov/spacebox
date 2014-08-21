$(document).ready(function() {
    $('#vk-login-button').click(function (event) {
        event.preventDefault();
   
        vk.login(function () {
        	navigation.go('mainPage');
        });
    });
});
