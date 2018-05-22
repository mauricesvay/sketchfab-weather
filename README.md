# Sketchfab Weather

Upload 3D model of current weather to Sketchfab

## Getting started

* `npm install` to install dependencies
* Add the config to the environment, or to a `.env` file
    * `OPENWEATHER_APPID` : [App ID for OpenWeatherMap](https://openweathermap.org/appid)
    * `OPENWEATHER_CITY_ID` : City ID from OpenWeatherMap. E.g. Paris, France is `2988507`.
    * `SKETCHFAB_MODEL_UID` : Sketchfab Model UID that will be updated.
    * `SKETCHFAB_TOKEN` : [Sketchfab API Token](https://sketchfab.com/settings/password)
    * `WORKING_DIR` : working directory. E.g. `./tmp/`.
* `npm start` to run