function PropertiesViewController ($scope, $modal, $location, UserService, ConfigService, StatusService, AccountService) {
    $scope.profile = true;
    $scope.version = ConfigService.VERSION;
    $scope.properties = ['profile', 'search', 'application'];
    $scope.propertyNames = {
        profile: 'Профиль',
        search: 'Опции поиска',
        application: 'Настройки'
    };
    $scope.selectedProperty = null;
    $scope.selectProperty = function (property) {
        if ($scope.properties.indexOf(property) != -1) {
            $scope.selectedProperty = property;
        }
    };

    $scope.info = UserService.getInfo();
    UserService.asyncGetPhotos().then(function (images) {
        $scope.photos = images;
    });

    $scope.toggle = function (value) {
        $scope.profile = value;
        $scope.changed = false;
    };

    StatusService.get().then(function (status) {
        $scope.status = status.text;
    });

    $scope.changed = false;

	var options = ConfigService.getSearchOptions();

    $scope.visibility = options.enabled;
    $scope.sex = options.sex;
    $scope.$watch('sex', optionsChanged);

     function optionsChanged () {
        $scope.changed = true;
    }

    var ages = $('#spSliderValue');
	var ageSlider = $('#spAgeSlider').slider({
		value: [
            options.ageInterval.bottom,
            options.ageInterval.top
        ],
		tooltip: 'hide',
		min: 18,
		max: 50,
		step: 1
	});
    ages.text(ageSlider.slider('getValue').join('-'));
	ageSlider.on('slide', function (event) {
        ages.text(event.value.join('-'));
        $scope.$apply(optionsChanged);
	});
    ageSlider.on('onSlideStop', function () {
        $scope.$apply(optionsChanged);
    });
    ageSlider.parent().click( function () {
        ages.text(ageSlider.slider('getValue').join('-'));
        $scope.$apply(optionsChanged);
	});

    var distance = $('#spDistanceValue');
	var distanceSlider = $('#spDistanceSlider').slider({
		value: options.radius/1000,
		tooltip: 'hide',
		min: 1,
		max: 50,
		step: 1
	});
    distance.text(distanceSlider.slider('getValue') + ' км');
    distanceSlider.on('slide', function (event) {
        distance.text(event.value + ' км');
        $scope.$apply(optionsChanged);
	});
    distanceSlider.on('onSlideStop', function () {
        $scope.$apply(optionsChanged);
    });
    distanceSlider.parent().click( function () {
        distance.text(distanceSlider.slider('getValue') + ' км');
        $scope.$apply(optionsChanged);
	});

    $scope.save = function () {
        var options = {};
        var ages = ageSlider.slider('getValue');
        options.enabled = $scope.visibility;
        options.sex = parseInt($scope.sex);
        options.radius = distanceSlider.slider('getValue') * 1000;
        options.ageInterval = {
            top: ages[1],
            bottom: ages[0]
        };
        ConfigService.setSearchOptions(options);
        StatusService.set($scope.status);
        $scope.changed = false;
        $scope.selectedProperty = null;
    };

    $scope.dialogs = {};
    $scope.dialogs.destroy = {
        title: 'Вы уверены, что хотите удалить аккаунт?',
        description: 'При удалении вашего аккаунта будут безвозвратно \
            удалены ваши друзья, профиль и фотографии.',
        ok: 'Удалить аккаунт',
        cancel: 'Отмена'
    };

    $scope.destroy = function () {
        var dialog = $modal.open({
            templateUrl: 'src/js/app/templates/modals/dialog.html',
            windowClass: 'dialog',
            controller: 'DialogController',
            resolve: {
                text: function () {
                    return $scope.dialogs.destroy;
                }
            },
            size: 'sm',
            backdrop: 'static'
        });

        dialog.result.then(function () {
            AccountService.asyncDestroy().then(function () {
                $location.path('/login');
            });
        });
    };
}

angular.module('spacebox').controller('PropertiesViewController',
    ['$scope', '$modal', '$location', 'UserService', 'ConfigService', 'StatusService', 'AccountService', PropertiesViewController]);
