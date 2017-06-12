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
            try {
                return unflatten(
                    serializer.parse(types[i], fs.readFileSync(fullPath, 'utf8')));
            }
            catch(e) {
                if (e instanceof SyntaxError) {
                    if (e.message === 'Syntax error on line undefined, column undefined: One top level value expected') {
                        return {};
                    }
                }
                throw e;
            }
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

function loadConfig(dir, env, prefix, localName) {
    dir = dir || 'config';
    env = env || process.env.NODE_ENV || 'development';
    prefix = prefix || 'XCFG_';
    localName = localName || 'local';

    return _.merge(
        readFile(path.resolve(dir, 'default')),
        readFile(path.resolve(dir, env)),
        readFile(path.resolve(dir, localName)),
        readEnv(prefix));
}

module.exports = loadConfig;
module.exports.readFile = readFile;
module.exports.readEnv = readEnv;
