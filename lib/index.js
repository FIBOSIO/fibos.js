var patch = require('./patch');

var is_fibjs = false;

try {
    is_fibjs = !!process.versions.fibjs
} catch (e) {}

if (is_fibjs) {
    var vm = require('vm');

    var sbox = new vm.SandBox({
        buffer: Buffer,
        assert: require("assert"),
        crypto: require('crypto'),
        "node-fetch": require('./fetch')
    });

    var eosjs = sbox.require('eosjs', __filename);
    module.exports = patch(eosjs);
} else {
    module.exports = patch(require('eosjs'));
}