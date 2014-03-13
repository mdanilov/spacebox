function library (module) {
    $(function () {
        if (module.init) {
            module.init();
        }
    });

    return module;
}
