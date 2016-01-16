angular.module('Guardian')
    .directive('weatherDir', function factory(weatherService) {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/directives/weather/weather-dir.html',

            link: function ($scope, elem, attrs) {
                $scope.cityId = '5243008';

                $scope.makeIconSrc = function makeIconSrc(icon) {
                    return makeIconSrc(icon);
                };

                $scope.$watch('cityId', function (newvalue, oldvalue) {
                    getCurrentWeather($scope, weatherService);
                    getForecast($scope, weatherService);
                });

                getCurrentWeather($scope, weatherService);
                getForecast($scope, weatherService);
            }
        };
    });

function makeIconSrc(icon) {
    return "http://openweathermap.org/img/w/" + icon + ".png";
}

function getCurrentWeather($scope, weatherService) {
    var weather = weatherService.getCurrentWeatherByCity($scope.cityId);
    weather.then(function (answer) {
        $scope.weather = answer.data;
        $scope.iconSrc = makeIconSrc(answer.data.weather[0].icon);
    });
}

function getForecast($scope, weatherService) {
    var forecast = weatherService.getForecastByCity($scope.cityId);
    forecast.then(function (answer) {
        $scope.forecast = answer.data;
    })
}