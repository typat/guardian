angular.module('Guardian')
    .directive('weatherDir', function factory() {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/directives/weather/weather-dir.html',
            link: function ($scope, elem, attrs) {

            }
        };
    });