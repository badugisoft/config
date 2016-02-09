var path = require('path');
var fs = require('fs');
var serializer = require('bs-serializer');
var unflatten = require('flat').unflatten;
var _ = require('lodash');
var types = serializer.types();

function readFile(filePath) {
    for (var i in types) {
        var fullPath = filePath + '.' + types[i];
        if (fs.existsSync(fullPath)) {
            return unflatten(
                serializer.parse(types[i], fs.readFileSync(fullPath, 'utf8')));
        }
    }
    return {};
}

function readEnv(prefix) {
    var obj = {};
    for (var key in process.env) {
        if(key.indexOf(prefix) === 0 && key.length > prefix.length) {
            obj[key.substr(prefix.length)] = process.env[key];
        }
    }
    return unflatten(obj, { delimiter: '_' });
}

function loadConfig(dir, env, prefix) {
    dir = dir || 'config';
    env = env || process.env.NODE_ENV || 'development';
    prefix = dir || 'XCFG_';

    return _.merge(
        readFile(path.resolve(dir, 'default')),
        readFile(path.resolve(dir, env)),
        readFile(path.resolve(dir, 'local')),
        readEnv(prefix));
}

module.exports = loadConfig;
module.exports.readFile = readFile;
module.exports.readEnv = readEnv;
