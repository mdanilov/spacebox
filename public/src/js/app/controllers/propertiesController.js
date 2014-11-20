function PropertiesViewController ($scope, ConfigService) {
	$scope.status = {text: '', length: 100, maxLength: 100};
    $scope.changed = false;

	$scope.checkLength = function() {
		var status = $scope.status;
		if (status.text.length > status.maxLength) {
			status.length = 0;
			status.text = status.text.substring(0, status.maxLength);
		} 
		else {
			status.length = status.maxLength - status.text.length;			
		}
		$scope.status = status;
	};

	var options = ConfigService.getSearchOptions();

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
	});
    ageSlider.on('onSlideStop', function () {
        $scope.changed = true;
        $scope.$apply();
    });
    ageSlider.parent().click( function (clickEvt) {
        ages.text(ageSlider.slider('getValue').join('-'));
        $scope.changed = true;
        $scope.$apply();
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
	});
    distanceSlider.on('onSlideStop', function () {
        $scope.changed = true;
        $scope.$apply();
    });
    distanceSlider.parent().click( function (clickEvt) {
        distance.text(distanceSlider.slider('getValue') + ' км');
        $scope.changed = true;
        $scope.$apply();
	});

    $scope.save = function () {
        var options = {};
        var ages = ageSlider.slider('getValue');
        options.sex = 0;
        options.radius = distanceSlider.slider('getValue') * 1000;
        options.ageInterval = {
            top: ages[1],
            bottom: ages[0]
        };
        ConfigService.setSearchOptions(options);
        $scope.changed = false;
    }
}

angular.module('spacebox').controller('PropertiesViewController',
    ['$scope', 'ConfigService', PropertiesViewController]);
