var path = require('path');
var fs = require('fs');
var serializer = require('bs-serializer');
var unflatten = require('flat').unflatten;
var _ = require('lodash');
var types = serializer.types();

function readFile(filePath, loaded) {
    for (var i in types) {
        var fullPath = filePath + '.' + types[i];
        if (fs.existsSync(fullPath)) {
            try {
                var res = unflatten(serializer.parse(types[i], fs.readFileSync(fullPath, 'utf8')));

                if (loaded && JSON.stringify(res) !== "{}")
                    loaded.push(path.basename(fullPath));

                return res;
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

function readEnv(prefix, loaded) {
    var obj = {};
    for (var key in process.env) {
        if(key.indexOf(prefix) === 0 && key.length > prefix.length) {
            obj[key.substr(prefix.length)] = process.env[key];
            if (loaded) loaded.push(key);
        }
    }

    return unflatten(obj, { delimiter: '_' });
}

function loadConfig(dir, env, prefix, localName) {
    dir = dir || 'config';
    env = env || process.env.NODE_ENV || 'development';
    prefix = prefix || 'XCFG_';
    localName = localName || 'local';

    var loaded = [];
    var result = _.merge(
        readFile(path.resolve(dir, 'default'), loaded),
        readFile(path.resolve(dir, env), loaded),
        readFile(path.resolve(dir, localName), loaded),
        readEnv(prefix, loaded));

    return _.merge({_loaded: loaded}, result);
}

module.exports = loadConfig;
module.exports.readFile = readFile;
module.exports.readEnv = readEnv;
