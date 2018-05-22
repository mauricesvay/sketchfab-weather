const weather = require('openweather-apis');

function Weather(params) {
    this.app_id = params.app_id;
}

Weather.prototype.getWeather = function(params) {
    return new Promise((resolve, reject) => {
        weather.setAPPID(this.app_id);
        weather.setLang('en');
        weather.setUnits('metric');
        // weather.setCity("Paris");
        weather.setCityId(params.city_id);
        weather.getAllWeather(function(err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}

module.exports = Weather;
