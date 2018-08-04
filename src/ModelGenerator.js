const fs = require("fs");
const path = require("path");
const THREE = require("three");
const GLTFExporter = require("./three/GLTFExporter");
const OBJLoader = require("./three/OBJLoader");
const MTLLoader = require("./three/MTLLoader");
// const FontJson = require("./three/fonts/helvetiker_regular.typeface.json");
const FontJson = require("./three/fonts/OpenSans_Regular.json");

function ModelGenerator(params) {
    this.dir_output = params.dir_output;
}

ModelGenerator.prototype = {
    generate: function(weatherData) {
        return new Promise(async (resolve, reject) => {
            const scene = new THREE.Scene();
            const material = new THREE.MeshPhysicalMaterial({ color: 0xff9e3a });

            // Text
            const loader = new THREE.FontLoader();
            const font = loader.parse(FontJson);
            const text = `${weatherData.name} ${parseInt(weatherData.main.temp, 10)}°C`;
            const textGeo = new THREE.TextGeometry(text, {
                font: font,
                size: 1,
                height: 0.2,
                curveSegments: 4,
                bevelThickness: 0.01,
                bevelSize: 0.02,
                bevelEnabled: true
            });
            const textMesh = new THREE.Mesh(textGeo, material);
            let bbox = new THREE.Box3().setFromObject(textMesh);
            let center = new THREE.Vector3();
            bbox.getCenter(center);
            textMesh.translateX(-center.x);
            scene.add(textMesh);

            // Icon
            let iconCode = weatherData.weather[0].icon;
            var icons = {
                "01d": "01d",
                "01n": "01d",
                "02d": "02d",
                "02n": "02d",
                "03d": "03d",
                "03n": "03d",
                "04d": "03d",
                "04n": "03d",
                "09d": "10d",
                "09n": "10d",
                "10d": "10d",
                "10n": "10d",
                "11d": "11d",
                "11n": "11d",
                "13d": "13d",
                "13n": "13d",
                "50d": "03d",
                "50n": "03d"
            };

            if (icons.hasOwnProperty(iconCode)) {
                iconCode = icons[iconCode];
            } else {
                iconCode = "03d";
            }

            try {
                const iconMesh = await this.getIcon(iconCode);
                scene.add(iconMesh);
            } catch (err) {
                reject(err);
            }

            // glTF export
            const exporter = new GLTFExporter();
            const exporterOptions = {
                embedImages: false
            };
            exporter.parse(
                scene,
                result => {
                    const gltf = JSON.stringify(result);
                    fs.writeFile(
                        path.resolve(this.dir_output, "weather.gltf"),
                        gltf,
                        { encoding: "utf8" },
                        err => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(gltf);
                            }
                        }
                    );
                },
                exporterOptions
            );
        });
    },

    getIcon: function(code) {
        return new Promise((resolve, reject) => {
            const mtlLoader = new MTLLoader();
            mtlLoader.setPath("src/assets/");
            fs.readFile(`./src/assets/${code}.mtl`, { encoding: "utf8" }, (err, mtl) => {
                if (err) {
                    reject(err);
                }
                const mtlResult = mtlLoader.parse(mtl);
                const objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(mtlResult);
                fs.readFile(`./src/assets/${code}.obj`, { encoding: "utf8" }, (err, obj) => {
                    if (err) {
                        reject(err);
                    }
                    const objResult = objLoader.parse(obj);
                    resolve(objResult);
                });
            });
        });
    }
};

module.exports = ModelGenerator;
