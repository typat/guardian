angular.module('Guardian')
    .directive('homeDir', function factory() {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/directives/home/home-dir.html',
            link: function ($scope, elem, attrs) {

            }
        };
    });