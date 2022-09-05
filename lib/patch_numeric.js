var numeric = require('eosjs/dist/eosjs-numeric');

numeric.prefix = "FO";

var stringToPublicKey = numeric.stringToPublicKey;
numeric.stringToPublicKey = function (s) {
    if (typeof s !== 'string')
        throw new Error('expected string containing public key');

    if (s.substr(0, numeric.prefix.length) === numeric.prefix)
        s = "EOS" + s.substr(numeric.prefix.length);

    return stringToPublicKey(s);
};

numeric.convertLegacyPublicKey = function (s) {
    if (s.substr(0, numeric.prefix.length) === numeric.prefix)
        return numeric.publicKeyToString(numeric.stringToPublicKey(s));

    return s;
};

var publicKeyToLegacyString = numeric.publicKeyToLegacyString;
numeric.publicKeyToLegacyString = function (key) {
    if (key.type === 0 && key.data.length === 33) {
        var s = publicKeyToLegacyString(key);
        return numeric.prefix + s.substr(3);
    }
    else
        return publicKeyToLegacyString(key);
};

module.exports = numeric;
