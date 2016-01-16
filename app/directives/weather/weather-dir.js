angular.module('Guardian')
    .directive('weatherDir', function factory(weatherService) {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/directives/weather/weather-dir.html',

            link: function ($scope, elem, attrs) {
                $scope.cityId = '5243008';
                $scope.forecast = {};
                $scope.forecast.list = [];

                $scope.makeIconSrc = function makeIconSrc(icon) {
                    return makeIconSrc(icon);
                };

                $scope.$watch('cityId', function (newvalue, oldvalue) {
                    getCurrentWeather($scope, weatherService);
                    getForecast($scope, weatherService);
                });

                getCurrentWeather($scope, weatherService);
                getForecast($scope, weatherService);

                $scope.options = {
                    margin: {top: 5},
                    series: [
                        {
                            axis: "y",
                            dataset: "dataset",
                            key: "temp",
                            color: "hsla(88, 48%, 48%, 1)",
                            type: ['line', 'dot']
                        }
                    ],
                    axes: {
                        x: {
                            key: "dt",
                            type: "date",
                            tickFormat: function (value, index) {
                                return "";
                            }
                        },
                        y: {
                            min: 0, max: 60,
                            tickFormat: function (value, index) {
                                return "";
                            }
                        }
                    },
                    grid: {
                        x: true,
                        y: true
                    }
                };

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

        var dataset0 = [];
        for (var i = 0; i < $scope.forecast.list.length; i++) {
            dataset0.push({
                dt: new Date($scope.forecast.list[i].dt_txt),
                temp: $scope.forecast.list[i].main.temp,
                minTemp: $scope.forecast.list[i].main.temp_min,
                maxTemp: $scope.forecast.list[i].main.temp_max
            })
        }
        $scope.data = {dataset: dataset0};
    });
}