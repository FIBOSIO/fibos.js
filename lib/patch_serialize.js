var numeric = require("eosjs/dist/eosjs-numeric");
var serialize = require('eosjs/dist/eosjs-serialize');

var createInitialTypes = serialize.createInitialTypes;

serialize.createInitialTypes = function () {
    var types = createInitialTypes();
    types.set('uint256', {
        name: "uint256",
        aliasOfName: "",
        arrayOf: null,
        optionalOf: null,
        extensionOf: null,
        baseName: "",
        base: null,
        fields: [],
        serialize: function (buffer, data) { buffer.pushArray(numeric.decimalToBinary(32, '' + data)); },
        deserialize: function (buffer) { return numeric.binaryToDecimal(buffer.getUint8Array(32)); },
    });

    types.set('int256', {
        name: "int256",
        aliasOfName: "",
        arrayOf: null,
        optionalOf: null,
        extensionOf: null,
        baseName: "",
        base: null,
        fields: [],
        serialize: function (buffer, data) { buffer.pushArray(numeric.signedDecimalToBinary(32, '' + data)); },
        deserialize: function (buffer) { return numeric.signedBinaryToDecimal(buffer.getUint8Array(32)); },
    });

    return types;
};

module.exports = serialize;
