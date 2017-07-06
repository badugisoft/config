var assert = require('assert');
var loadConfig = require('../lib/config');

describe('basic', function() {
    it('load', function() {
        try {
            console.log(loadConfig('test/config'));
        }
        catch (e) {
            assert(false, e.stack);
        }
    });
});
