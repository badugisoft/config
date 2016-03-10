#!/usr/local/bin/node

var commander = require('commander');
var fs = require('fs');
var path = require('path');
var serializer = require('bs-serializer');
var loadConfig = require('../lib/config');
var packageJson = require('../package.json');

commander
    .version(packageJson.version)
    .usage('[<config path>]')
    .option('-t, --type [' + serializer.types().join('|') + ']', 'default) json')
    .option('-i, --indent [indent string or space count]', 'default) 2')
    .option('-k, --init', 'initialize config directory')
    .parse(process.argv);

var type = commander.type || 'json';
var indent = commander.indent || 2;
var configDir = commander.args[0] || 'config';

if (commander.init) {
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir);
    }

    var files = ['default', 'production', 'development', 'local'];
    files.forEach(function(file) {
        var configPath = configDir + '/' + file + '.' + type;
        if (!fs.existsSync(configPath)) {
            fs.writeFileSync(configPath, serializer.stringify(type, { name: 'value' }, null, indent));
        }
    });
}
else {
    console.log(serializer.stringify(type, loadConfig(configDir), null, indent));
}
