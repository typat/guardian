angular.module('Guardian')
    .directive('homeDir', function factory($sce) {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/directives/home/home-dir.html',
            link: function ($scope, elem, attrs) {
                $scope.weatherImgSrc = $sce.trustAsResourceUrl('http://icons.iconarchive.com/icons/wineass/ios7-redesign/512/Weather-icon.png');
            }
        };
    });