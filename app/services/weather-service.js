Guardian.factory('weatherService', ['$http', function ($http) {
    return {
        getCurrentWeatherByCity: function (cityId) {
            return $http({
                url: 'http://api.openweathermap.org/data/2.5/weather',
                method: 'GET',
                params: {
                    id: cityId,
                    APPID: '165c345dfb6798bcf28520f071ff5b00',
                    units: 'imperial'
                }
            })
        },
        getForecastByCity: function (cityId) {
            return $http({
                url: 'http://api.openweathermap.org/data/2.5/forecast',
                method: 'GET',
                params: {
                    id: cityId,
                    APPID: '165c345dfb6798bcf28520f071ff5b00',
                    units: 'imperial'
                }
            })
        }
    }
}])