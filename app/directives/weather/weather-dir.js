angular.module('Guardian')
    .directive('weatherDir', function factory(weatherService, $sce, d3Service, $window) {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/directives/weather/weather-dir.html',

            link: function ($scope, elem, attrs) {
                $scope.homeIconSrc = $sce.trustAsResourceUrl('http://icons.iconarchive.com/icons/alecive/flatwoken/256/Apps-Home-icon.png');
                $scope.cityId = '5243008';
                $scope.city = 'Williston';
                $scope.forecast = {};
                $scope.forecast.list = [];

                $scope.makeIconSrc = function makeIconSrc(icon) {
                    return makeIconSrc(icon);
                };

                getCurrentWeather($scope, weatherService);
                var forecast = getForecast($scope, weatherService);
                forecast.then(function () {
                    var d3 = d3Service.d3().then(function (d3) {
                        var margin = parseInt(attrs.margin) || 20,
                            barHeight = parseInt(attrs.barHeight) || 20,
                            barPadding = parseInt(attrs.barPadding) || 5;

                        var svg = d3.select(elem[0])
                            .append("svg")
                            .style('width', '100%');


                        // Browser onresize event
                        window.onresize = function () {
                            $scope.$apply();
                        };

                        // Watch for resize event
                        $scope.$watch(function () {
                            return angular.element($window)[0].innerWidth;
                        }, function () {
                            $scope.render($scope.data);
                        });

                        $scope.$watch('cityId', function () {
                            getCurrentWeather($scope, weatherService);
                            getForecast($scope, weatherService);
                            $scope.render($scope.data);
                        });

                        $scope.render = function (data) {
                            svg.selectAll('*').remove();
                            d3.selectAll("svg > *").remove();

                            if (!data) return;

                            var vis = d3.select('#visualisation'),
                                WIDTH = d3.select(elem[0]).node().offsetWidth,
                                HEIGHT = 500,
                                MARGINS = {
                                    top: 20,
                                    right: 20,
                                    bottom: 20,
                                    left: 50
                                },
                                xRange = d3.time.scale().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min($scope.data, function (d) {
                                    return d.dt;
                                }), d3.max($scope.data, function (d) {
                                    return d.dt;
                                })]),
                                yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min($scope.data, function (d) {
                                    return d.temp;
                                }), d3.max($scope.data, function (d) {
                                    return d.temp;
                                })]),
                                xAxis = d3.svg.axis()
                                    .scale(xRange)
                                    .tickSize(3)
                                    .tickSubdivide(true),
                                yAxis = d3.svg.axis()
                                    .scale(yRange)
                                    .tickSize(3)
                                    .orient('left')
                                    .tickSubdivide(true);

                            vis.append('svg:g')
                                .attr('class', 'x axis')
                                .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
                                .call(xAxis);

                            vis.append('svg:g')
                                .attr('class', 'y axis')
                                .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
                                .call(yAxis);

                            var lineFunc = d3.svg.line()
                                .x(function (d) {
                                    return xRange(d.dt);
                                })
                                .y(function (d) {
                                    return yRange(d.temp);
                                })
                                .interpolate('basis');

                            vis.append('svg:path')
                                .attr('d', lineFunc($scope.data))
                                .attr('stroke', 'blue')
                                .attr('stroke-width', 2)
                                .attr('fill', 'none');
                        };
                    });
                });
            }
        };
    });

function makeIconSrc(icon) {
    return "http://openweathermap.org/img/w/" + icon + ".png";
}

function getCurrentWeather($scope, weatherService) {
    var weather = weatherService.getCurrentWeatherByCity($scope.cityId);
    weather.then(function (answer) {
        answer.data.date = timeConverter(answer.data.dt);
        $scope.weather = answer.data;
        $scope.iconSrc = makeIconSrc(answer.data.weather[0].icon);
    });
}

function getForecast($scope, weatherService) {
    var deferred = $.Deferred();
    var forecast = weatherService.getForecastByCity($scope.cityId);
    forecast.then(function (answer) {
        $scope.forecast = answer.data;

        var dataset = [];
        for (var i = 0; i < $scope.forecast.list.length; i++) {
            dataset.push({
                dt: new Date($scope.forecast.list[i].dt * 1000),
                temp: $scope.forecast.list[i].main.temp,
                minTemp: $scope.forecast.list[i].main.temp_min,
                maxTemp: $scope.forecast.list[i].main.temp_max,
                snow: answer.data.list[i].snow['3h'] ? answer.data.list[i].snow['3h'] : 0
            });
        }
        $scope.data = dataset;
        deferred.resolve(dataset);
    });
    return deferred.promise();
}

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    return `${month} ${date}, ${year}`;
}