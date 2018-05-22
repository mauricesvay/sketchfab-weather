const OBJFile = require('obj-file-parser');
const JSM = require('./lib/jsmodeler/jsmodeler');
const font = require('./lib/jsmodeler/font/firasans.json');
const fs = require('fs');
const path = require('path');

const OBJ_OUTPUT = path.resolve(__dirname, '../tmp/weather/weather.obj');

function ModelGenerator(params) {
    this.obj_output = params.obj_output;
}

ModelGenerator.prototype = {
    generate: function(weatherData) {
        return new Promise(async (resolve, reject) => {
            //Generate 3D text
            var text = 'Paris ' + parseInt(weatherData.main.temp, 10) + '°C';
            var model = new JSM.Model();
            var text = JSM.GenerateText(text, font, 0.001, 0.5, 10);
            var materials = new JSM.MaterialSet();
            materials.AddMaterial(
                new JSM.Material({
                    ambient: 0x000000,
                    diffuse: 0x111111
                })
            );

            for (var i = 0; i < text.BodyCount(); i++) {
                JSM.TriangulatePolygons(text.GetBody(i));
                model.AddBody(text.GetBody(i));
            }
            var obj = JSM.ExportModelToObj(model, 'JSModelerBody', false);

            // Merge with icon
            var iconCode = weatherData.weather[0].icon;
            if (iconCode.indexOf('01') === 0) {
                iconCode = '01';
            } else if (iconCode.indexOf('09') === 0 || iconCode.indexOf('10') === 0) {
                iconCode = '10';
            } else {
                iconCode = '03';
            }
            var iconMesh = await this.getIcon(iconCode);
            var scene = serializeObj(mergeObj(obj, iconMesh));

            // Save to obj file
            fs.writeFile(this.obj_output, scene, 'utf8', function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    getIcon: function(code) {
        return new Promise((resolve, reject) => {
            var filePath = path.resolve(__dirname, `./assets/${code}.obj`);
            fs.readFile(filePath, 'utf8', function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
};

function mergeObj(obj1, obj2) {
    var models = [];
    var file1 = new OBJFile(obj1);
    var output1 = file1.parse();
    models = models.concat(output1.models);

    var file2 = new OBJFile(obj2);
    var output2 = file2.parse();
    models = models.concat(output2.models);

    return models;
}

/**
 * Serializes meshes to OBJ
 * Support vertex, vertex normals, and faces
 * @TODO add UV, material, smoothing groups
 */
function serializeObj(meshes) {
    var out = '';
    var vertexIndexOffset = 0;
    var vertexNormalsIndexOffset = 0;
    out += `mtllib weather.mtl\n`;
    for (var i = 0; i < meshes.length; i++) {
        out += 'o ' + meshes[i].name + '\n';

        var vertex;
        for (var j = 0; j < meshes[i].vertices.length; j++) {
            vertex = meshes[i].vertices[j];
            out += `v ${vertex.x} ${vertex.y} ${vertex.z}\n`;
        }

        var vertexNormal;
        for (var k = 0; k < meshes[i].vertexNormals.length; k++) {
            vertexNormal = meshes[i].vertexNormals[k];
            out += `vn ${vertexNormal.x} ${vertexNormal.y} ${vertexNormal.z}\n`;
        }

        var face, faceVertices, faceMaterial, previousFaceMaterial;
        previousFaceMaterial = '';
        for (var l = 0; l < meshes[i].faces.length; l++) {
            face = meshes[i].faces[l];

            if (face.material) {
                faceMaterial = face.material;
            } else {
                faceMaterial = 'Default';
            }

            faceVertices = face.vertices
                .map(vertex => {
                    return (
                        vertexIndexOffset +
                        vertex.vertexIndex +
                        '/' +
                        (vertex.textureCoordsIndex === 0 ? '' : vertex.textureCoordsIndex) +
                        '/' +
                        (vertexNormalsIndexOffset + vertex.vertexNormalIndex)
                    );
                })
                .join(' ');

            if (faceMaterial !== previousFaceMaterial) {
                out += `usemtl ${faceMaterial}\n`;
                previousFaceMaterial = faceMaterial;
            }

            out += `f ${faceVertices}\n`;
        }

        vertexIndexOffset += meshes[i].vertices.length;
        vertexNormalsIndexOffset += meshes[i].vertexNormals.length;
    }

    return out;
}

module.exports = ModelGenerator;
