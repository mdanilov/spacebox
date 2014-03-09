$(document).ready(function() {

    var context = new Context();
    var display = new Display(context);

    $('#search').click(function(event) {
        event.preventDefault();
        context.update(display.render);
    });

    $('#vk-logout').click(function(event) {
        event.preventDefault();
        VK.Auth.logout();
        $.get('/logout').success(function (data) {
            window.location.replace(window.location);
        });
    });

    fm_options = {
        jQueryUI : false,
        position : "right-bottom",
        close_on_click_outisde: true,
        name_label: "Ваше имя:",
        name_placeholder: "",
        name_required: false,
        trigger_label : "Помощь",
        message_label: "Здесь Вы можете сообщить нам о любой проблеме, связанной с сервисом:",
        message_required : true,
        message_placeholder: "Пожалуйста опишите Вашу проблему.",
        show_asterisk_for_required : false,
        title_label: "Обратная связь",
        submit_label: "Отправить",
        feedback_url : "feedback"
    };

    fm.init(fm_options);
});
