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

const DIR_OUTPUT = path.resolve(config.WORKING_DIR, "weather");

main();

async function main() {
    console.log("Getting weather data");
    const weather = new Weather({
        app_id: config.OPENWEATHER_APPID
    });
    try {
        var weatherResult = await weather.getWeather({
            city_id: config.OPENWEATHER_CITY_ID
        });
        if (weatherResult.cod !== 200) {
            throw new Error(weatherResult);
        }
    } catch (err) {
        return console.error("Can not get weather data", err);
    }

    console.log("Generating model");
    const modelGenerator = new ModelGenerator({
        dir_output: DIR_OUTPUT
    });
    try {
        var modelResult = await modelGenerator.generate(weatherResult);
    } catch (err) {
        return console.error("Cannot generate model", err);
    }

    console.log("Uploading model");
    const uploader = new Uploader({
        sketchfab_model_uid: config.SKETCHFAB_MODEL_UID,
        sketchfab_token: config.SKETCHFAB_TOKEN,
        model_dir: DIR_OUTPUT
    });
    try {
        var uploadResult = await uploader.upload();
        console.log("Uploaded");
    } catch (err) {
        if (err.response) {
            console.error(err.response.data);
        } else {
            console.error(err);
        }
    }
}
