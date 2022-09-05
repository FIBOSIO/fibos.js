var crypto = require('crypto');
var base64 = require('base64');

var BN = require('bn.js');
var EC = require('elliptic').ec;
var Signature = require('elliptic/lib/elliptic/ec/signature')

var sign = EC.prototype.sign;
EC.prototype.sign = function (msg, key, enc, options) {
    if (this.curve.red.prime && this.curve.red.prime.name == 'k256') {
        if (typeof enc === 'object') {
            options = enc;
            enc = null;
        }
        if (!options)
            options = {};

        key = this.keyFromPrivate(key, enc);
        var sk = crypto.PKey.from({
            "kty": "EC",
            "crv": "secp256k1",
            "d": base64.encode(key.priv.toArray())
        });

        var sig = sk.sign(msg, {
            recoverable: true
        });

        return new Signature({
            r: new BN(sig.slice(0, 32)),
            s: new BN(sig.slice(32, 64)),
            recoveryParam: sig[64]
        });
    }

    return sign.call(this, msg, key, enc, options);
};

var verify = EC.prototype.verify;
EC.prototype.verify = function (msg, signature, key, enc) {
    if (this.curve.red.prime && this.curve.red.prime.name == 'k256') {
        key = this.keyFromPublic(key, enc);
        var pk = crypto.PKey.from({
            "kty": "EC",
            "crv": "secp256k1",
            "x": base64.encode(key.pub.x.toArray()),
            "y": base64.encode(key.pub.y.toArray())
        });

        signature = new Signature(signature, 'hex');
        var sig = Buffer.concat([
            signature.r.toBuffer(true, 32),
            signature.s.toBuffer(true, 32)
        ]);

        return pk.verify(msg, sig, {
            format: 'bin'
        });
    }

    return verify.call(this, msg, signature, key, enc);
};

var recoverPubKey = EC.prototype.recoverPubKey;
EC.prototype.recoverPubKey = function (msg, signature, j, enc) {
    if (this.curve.red.prime && this.curve.red.prime.name == 'k256') {
        signature = new Signature(signature, enc);

        var sig = Buffer.concat([
            signature.r.toBuffer(true, 32),
            signature.s.toBuffer(true, 32),
            Buffer.from([signature.recoveryParam])
        ]);

        var pk = crypto.PKey.recover(msg, sig);
        var jwk = pk.json();
        return this.curve.point(new BN(base64.decode(jwk.x)), new BN(base64.decode(jwk.y)));
    }

    return recoverPubKey.call(this, msg, signature, j, enc);
}