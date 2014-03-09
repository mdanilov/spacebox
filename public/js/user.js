var VK_FIELDS = 'first_name, photo_50, screen_name';

function User(options) {

    this.getHtmlElement = function() {
        return new EJS({url: '/wildcard.ejs'}).render({
            photo_url: options.info.photo_50,
            first_name: options.info.first_name,
            screen_name: options.info.screen_name
        });
    }

    this.getLocation = function() {
        return options.location;
    }
}
