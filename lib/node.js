var numeric = require('./patch_numeric');
var Api = require('./patch_Api');

const eosjs = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');

function FIBOS(opts) {
    const { TextDecoder, TextEncoder } = require('util');

    var _opts = { ...opts };

    if (_opts.keyPrefix)
        numeric.prefix = _opts.keyPrefix;

    if (!_opts.textDecoder)
        _opts.textDecoder = new TextDecoder();

    if (!_opts.textEncoder)
        _opts.textEncoder = new TextEncoder();

    if (!_opts.signatureProvider && _opts.keyProvider) {
        var keyProvider = _opts.keyProvider;
        delete _opts.keyProvider;

        if (!Array.isArray(keyProvider))
            keyProvider = [keyProvider];

        _opts.signatureProvider = new JsSignatureProvider(keyProvider);
    }

    if (!_opts.rpc && _opts.httpEndpoint) {
        _opts.rpc = new eosjs.JsonRpc(_opts.httpEndpoint, { fetch });
        delete _opts.httpEndpoint;
    }

    return new eosjs.Api(_opts);
}

for (var n in eosjs)
    FIBOS[n] = eosjs[n];

FIBOS.ecc = require('eosjs/dist/eosjs-ecc-migration').ecc;

module.exports = FIBOS;
