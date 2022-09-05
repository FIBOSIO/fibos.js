var ripemd = require('eosjs/dist/ripemd');
var ripemd_ = require('hash').ripemd160;

ripemd.RIPEMD160.hash = function (data) {
    return ripemd_(data).digest();
};