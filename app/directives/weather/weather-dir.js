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

                $scope.$watch('cityId', function () {
                    getCurrentWeather($scope, weatherService);
                    getForecast($scope, weatherService);
                });

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

                        $scope.$watch('data', function () {
                            $scope.render($scope.data);
                        });

                        $scope.render = function (data) {
                            svg.selectAll('*').remove();
                            d3.selectAll("svg > *").remove();

                            if (!data) return;

                            //var x = d3.scale.ordinal().rangeRoundBands([50, d3.select(elem[0]).node().offsetWidth], .1);
                            //var y = d3.scale.linear().rangeRound([480, 20]);

                            var vis = d3.select('#visualisation'),
                                WIDTH = d3.select(elem[0]).node().offsetWidth - 40,
                                HEIGHT = 500,
                                MARGINS = {
                                    top: 20,
                                    right: 20,
                                    bottom: 20,
                                    left: 50
                                },
                                xTimeScale = d3.time.scale().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min($scope.data, function (d) {
                                    return d.dt;
                                }), d3.max($scope.data, function (d) {
                                    return d.dt;
                                })]),
                                xCardinalScale = d3.scale.ordinal().rangeRoundBands([MARGINS.left, WIDTH - MARGINS.right], .1).domain(data.map(function (d) {
                                    return d.dt;
                                })),
                                ySnowScale = d3.scale.linear().rangeRound([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, d3.max(data, function (d) {
                                    return d.snow;
                                })]),
                                yTempScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min($scope.data, function (d) {
                                    return d.temp;
                                }), d3.max($scope.data, function (d) {
                                    return d.temp;
                                })]),
                                xAxis = d3.svg.axis()
                                    .scale(xTimeScale)
                                    .tickSize(3)
                                    .tickSubdivide(true)
                                    .ticks(5),
                                yAxis = d3.svg.axis()
                                    .scale(yTempScale)
                                    .tickSize(3)
                                    .orient('left')
                                    .tickSubdivide(true),
                                ySnowAxis = d3.svg.axis()
                                    .scale(ySnowScale)
                                    .orient('right')
                                    .tickSize(3)
                                    .tickSubdivide(true);

                            vis.append('svg:g')
                                .attr('class', 'x axis')
                                .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
                                .transition()
                                .call(xAxis);

                            vis.append('svg:g')
                                .attr('class', 'y axis')
                                .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
                                .transition()
                                .call(yAxis);

                            vis.append('svg:g')
                                .attr("class", "y axis")
                                .attr("transform", "translate(" + (WIDTH - MARGINS.right) + ",0)")
                                .transition()
                                .call(ySnowAxis);

                            function make_x_axis() {
                                return d3.svg.axis()
                                    .scale(xTimeScale)
                                    .orient("bottom")
                                    .ticks(5)
                            }

                            function make_y_axis() {
                                return d3.svg.axis()
                                    .scale(yTempScale)
                                    .orient("left")
                                    .ticks(5)
                            }

                            // Draw the x Grid lines
                            vis.append("g")
                                .attr("class", "grid")
                                .attr("transform", "translate(0," + HEIGHT + ")")
                                .call(make_x_axis()
                                    .tickSize(-HEIGHT, 0, 0)
                                    .tickFormat("")
                                );

                            // Draw the y Grid lines
                            vis.append("g")
                                .attr("class", "grid")
                                .call(make_y_axis()
                                    .tickSize(-WIDTH, 0, 0)
                                    .tickFormat("")
                                );

                            // Add the text label for the X axis
                            vis.append("text")
                                .attr("transform", "translate(" + (WIDTH / 2) + " ," + (HEIGHT + MARGINS.bottom) + ")")
                                .style("text-anchor", "middle")
                                .text("Date");

                            // Add the text label for the Y axis
                            vis.append("text")
                                .attr("transform", "rotate(-90)")
                                .attr("y", 6)
                                .attr("x", MARGINS.top - (HEIGHT / 2))
                                .attr("dy", ".71em")
                                .style("text-anchor", "end")
                                .text("Temp");

                            // Add the text label for the Y2 axis
                            vis.append("text")
                                .attr("transform", "rotate(-90)")
                                .attr("y", WIDTH)
                                .attr("x", MARGINS.top - (HEIGHT / 2))
                                .attr("dy", "1.90em")
                                .style("text-anchor", "end")
                                .text("Precipitation (ft)");

                            vis.append('defs')
                                .append('pattern')
                                .attr('id', 'diagonalHatch')
                                .attr('patternUnits', 'userSpaceOnUse')
                                .attr('width', 20)
                                .attr('height', 20)
                                .append('svg:image')
                                .attr("xlink:href", "http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons-256/blue-tiedyed-cloth-icons-natural-wonders/050677-blue-tiedyed-cloth-icon-natural-wonders-snowflake1.png")
                                .attr("width", 30)
                                .attr("height", 30)
                                .attr("x", -10)
                                .attr("y", -10);

                            //add snow bars to graph
                            vis.selectAll(".bar")
                                .data($scope.data)
                                .enter().append("rect")
                                .attr("class", "bar")
                                .attr("x", function (d) {
                                    return xCardinalScale(d.dt);
                                })
                                .attr("width", xCardinalScale.rangeBand())
                                .attr("y", function (d) {
                                    return ySnowScale(d.snow);
                                })
                                .attr("height", function (d) {
                                    return HEIGHT - ySnowScale(d.snow) - MARGINS.bottom;
                                })
                                .style('fill', 'url(#diagonalHatch)')
                                .style("stroke", "lightblue");

                            var lineFunc = d3.svg.line()
                                .x(function (d) {
                                    return xTimeScale(d.dt);
                                })
                                .y(function (d) {
                                    return yTempScale(d.temp);
                                })
                                .interpolate('monotone');

                            //add temperature line to graph
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