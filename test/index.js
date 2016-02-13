var assert = require('assert');
var loadConfig = require('../lib/config');

describe('basic', function() {
    it('load', function() {
        try {
            loadConfig('test/config')
            assert(true);
        }
        catch (e) {
            assert(false, e.stack);
        }
    });
});
