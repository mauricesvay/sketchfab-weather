require("dotenv").config();

const path = require("path");
const Weather = require("./src/Weather");
const Uploader = require("./src/Uploader");
const ModelGenerator = require("./src/ModelGenerator");

const config = {
    OPENWEATHER_APPID: process.env.OPENWEATHER_APPID,
    OPENWEATHER_CITY_ID: process.env.OPENWEATHER_CITY_ID,
    SKETCHFAB_MODEL_UID: process.env.SKETCHFAB_MODEL_UID,
    SKETCHFAB_TOKEN: process.env.SKETCHFAB_TOKEN,
    WORKING_DIR: path.resolve(process.env.WORKING_DIR)
};

const files = {
    ZIP_OUTPUT: path.resolve(config.WORKING_DIR, "weather.zip"),
    DIR_OUTPUT: path.resolve(config.WORKING_DIR, "weather"),
    OBJ_OUTPUT: path.resolve(config.WORKING_DIR, "weather/weather.obj")
};

var weather = new Weather({
    app_id: config.OPENWEATHER_APPID
});

weather
    .getWeather({
        city_id: config.OPENWEATHER_CITY_ID
    })
    .then(async weatherResult => {
        console.log("Generating model");
        var modelGenerator = new ModelGenerator({
            obj_output: files.OBJ_OUTPUT
        });
        var modelResult = await modelGenerator.generate(weatherResult);

        console.log("Uploading model");
        var uploader = new Uploader({
            sketchfab_model_uid: config.SKETCHFAB_MODEL_UID,
            sketchfab_token: config.SKETCHFAB_TOKEN,
            obj_output: files.OBJ_OUTPUT,
            dir_output: files.DIR_OUTPUT,
            zip_output: files.ZIP_OUTPUT
        });

        try {
            var uploadResult = await uploader.upload();
        } catch (e) {
            if (e.response) {
                console.error(e.response.data);
            } else {
                console.error(e);
            }
        }

        console.log("Uploaded");
    });
