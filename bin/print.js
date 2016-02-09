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
    .parse(process.argv);

console.log(serializer.stringify(
    commander.type || 'json',
    loadConfig(commander.args[0]),
    null,
    commander.indent || 2));
