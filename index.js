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
    DIR_OUTPUT: path.resolve(config.WORKING_DIR, "weather")
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
            dir_output: files.DIR_OUTPUT
        });
        try {
            var modelResult = await modelGenerator.generate(weatherResult);
        } catch (err) {
            console.error("Cannot generate model", err);
            return;
        }

        console.log("Uploading model");
        var uploader = new Uploader({
            sketchfab_model_uid: config.SKETCHFAB_MODEL_UID,
            sketchfab_token: config.SKETCHFAB_TOKEN,
            model_dir: files.DIR_OUTPUT
        });
        try {
            var uploadResult = await uploader.upload();
            console.log("Uploaded");
        } catch (e) {
            if (e.response) {
                console.error(e.response.data);
            } else {
                console.error(e);
            }
        }
    });
