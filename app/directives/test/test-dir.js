angular.module('Guardian')
    .directive('testDir', function factory(d3Service, $window, weatherService) {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/directives/test/test-dir.html',

            link: function ($scope, elem, attrs) {
                $scope.cityId = '5243008';
                var forecast = weatherService.getForecastByCity($scope.cityId);
                forecast.then(function (answer) {
                    //$scope.forecast = answer.data;
                    var dataset = [];
                    for (var i = 0; i < answer.data.list.length; i++) {
                        dataset.push({
                            dt: new Date(answer.data.list[i].dt * 1000),
                            temp: answer.data.list[i].main.temp,
                            snow: answer.data.list[i].snow['3h'] ? answer.data.list[i].snow['3h'] : 0
                        })
                    }
                    $scope.data = dataset;


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


                        //$scope.data = [
                        //    {
                        //        "dt": new Date(1453312800 * 1000),
                        //        "main": {
                        //            "temp": 267.92
                        //        }
                        //    },
                        //    {
                        //        "dt": new Date(1453323600 * 1000),
                        //        "main": {
                        //            "temp": 267.86
                        //        }
                        //    },
                        //    {
                        //        "dt": new Date(1453334400 * 1000),
                        //        "main": {
                        //            "temp": 265.32
                        //        }
                        //    }
                        //];

                        // Watch for resize event
                        $scope.$watch(function () {
                            return angular.element($window)[0].innerWidth;
                        }, function () {
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
        }
    });