const axios = require("axios");
const FormData = require("form-data");
const zipdir = require("zip-dir");

function Uploader(params) {
    this.sketchfab_model_uid = params.sketchfab_model_uid;
    this.sketchfab_token = params.sketchfab_token;
    this.obj_output = params.obj_output;
    this.dir_output = params.dir_output;
    this.zip_output = params.zip_output;
}

Uploader.prototype = {
    archive: function(dir, output) {
        return new Promise((resolve, reject) => {
            zipdir(dir, function(err, buffer) {
                if (err) {
                    reject(err);
                } else {
                    resolve(buffer);
                }
            });
        });
    },

    upload: async function() {
        var buffer;
        try {
            buffer = await this.archive(this.dir_output, this.zip_output);
        } catch (e) {
            throw new Error("Cannot generate archive");
        }

        var url = "https://api.sketchfab.com/v3/models/" + this.sketchfab_model_uid;
        const form = new FormData();
        form.append("name", "Current weather in Paris");
        form.append(
            "description",
            "This model auto-updates every hour with the weather in Paris. Last update: " +
                new Date().toISOString()
        );
        form.append("tags", "weather");
        form.append("modelFile", buffer, "weather.zip");

        var headers = form.getHeaders();
        headers["Authorization"] = "Token " + this.sketchfab_token;
        return axios.put(url, form, {
            headers: headers
        });
    }
};

module.exports = Uploader;
