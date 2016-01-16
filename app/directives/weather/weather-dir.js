angular.module('Guardian')
    .directive('weatherDir', function factory(weatherService) {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/directives/weather/weather-dir.html',
            link: function ($scope, elem, attrs) {
                var weather = weatherService.getCurrentWeatherByCity('5243008');
                weather.then(function (answer) {
                    $scope.weather = answer.data;
                });

                var forecast = weatherService.getForecastByCity('5243008');
                forecast.then(function (answer) {
                    $scope.forecast = answer.data;
                })
            }
        };
    });