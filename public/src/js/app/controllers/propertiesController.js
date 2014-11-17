function PropertiesViewController ($scope, ConfigService) {
	$scope.status = {text: '', length: 99, maxLength: 99};

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
	}

	var options = ConfigService.getSearchOptions();
	var values = [options.ageInterval.bottom,options.ageInterval.top];
	$("#spAgeSlider").slider({
		value: values,
		tooltip: 'hide',
		min: 18,
		max: 50,
		step: 1
	});
	$("#spSliderValue").text(values.join('-'));
	$("#spAgeSlider").on("slide", function(slideEvt) {
		$("#spSliderValue").text(slideEvt.value.join('-'));
	});

	$("#spDistanceSlider").slider({
		value: options.radius/1000,
		tooltip: 'hide',
		min: 1,
		max: 50,
		step: 1
	});
	$("#spDistanceValue").text(options.radius/1000 + ' км');
	$("#spDistanceSlider").on("slide", function(slideEvt) {
		$("#spDistanceValue").text(slideEvt.value + ' км');
	});
}

angular.module('spacebox').controller('PropertiesViewController',
    ['$scope', 'ConfigService', PropertiesViewController]);
