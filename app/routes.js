'use strict';

angular.module('Guardian').config(['$stateProvider', '$urlRouterProvider',
function ($stateProvider, $urlRouterProvider) {
    // For unmatched routes
    $urlRouterProvider.otherwise('/');

    //Application routes
    $stateProvider
        .state('index', {
            url: '/',
            template: "<home-dir></home-dir>"
        })
        .state('weather', {
            url: '/weather',
            template: "<weather-dir></weather-dir>"
        })
        .state('test', {
            url: '/test',
            template: "<test-dir></test-dir>"
        })
}]);