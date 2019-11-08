const assert = require('assert');

module.exports = function(eosjs, config={keyPrefix: 'FO'})
{
	Object.assign(eosjs.modules.json.schema, {
		extended_asset: {
			"fields": {
				"quantity": "asset",
				"contract": "account_name"
			}
		},
		extended_symbol: {
			"fields": {
				"sym": "symbol",
				"contract": "account_name"
			}
		},
		retire: {
			"base": "",
			"action": {
				"name": "retire",
				"account": "eosio.token"
			},
			"fields": {
				"quantity": "asset",
				"memo": "string"
			}
		},
		close: {
			"base": "",
			"action": {
				"name": "close",
				"account": "eosio.token"
			},
			"fields": {
				"owner": "account_name",
				"symbol": "symbol"
			}
		},
		excreate: {
			"base": "",
			"action": {
				"name": "excreate",
				"account": "eosio.token"
			},
			"fields": {
				"issuer": "account_name",
				"maximum_supply": "asset",
				"connector_weight": "float64",
				"maximum_exchange": "asset",
				"reserve_supply": "asset",
				"reserve_connector_balance": "asset",
				"expiration": "time_point_sec",
				"buy_fee": "float64",
				"sell_fee": "float64",
				"connector_balance_issuer": "account_name"
			}
		},
		exunlock: {
			"base": "",
			"action": {
				"name": "exunlock",
				"account": "eosio.token"
			},
			"fields": {
				"owner": "account_name",
				"quantity": "extended_asset",
				"expiration": "time_point_sec",
				"memo": "string"
			}
		},
		exlocktrans: {
			"base": "",
			"action": {
				"name": "exlocktrans",
				"account": "eosio.token"
			},
			"fields": {
				"from": "account_name",
				"to": "account_name",
				"quantity": "extended_asset",
				"expiration": "time_point_sec",
				"expiration_to": "time_point_sec",
				"memo": "string"
			}
		},
		exissue: {
			"base": "",
			"action": {
				"name": "exissue",
				"account": "eosio.token"
			},
			"fields": {
				"to": "account_name",
				"quantity": "extended_asset",
				"memo": "string"
			}
		},
		extransfer: {
			"base": "",
			"action": {
				"name": "extransfer",
				"account": "eosio.token"
			},
			"fields": {
				"from": "account_name",
				"to": "account_name",
				"quantity": "extended_asset",
				"memo": "string"
			}
		},
		exretire: {
			"base": "",
			"action": {
				"name": "exretire",
				"account": "eosio.token"
			},
			"fields": {
				"from": "account_name",
				"quantity": "extended_asset",
				"memo": "string"
			}
		},
		exclose: {
			"base": "",
			"action": {
				"name": "exclose",
				"account": "eosio.token"
			},
			"fields": {
				"owner": "account_name",
				"symbol": "extended_symbol"
			}
		},
		exdestroy: {
			"base": "",
			"action": {
				"name": "exdestroy",
				"account": "eosio.token"
			},
			"fields": {
				"symbol": "extended_symbol"
			}
		},
		exchange: {
			"base": "",
			"action": {
				"name": "exchange",
				"account": "eosio.token"
			},
			"fields": {
				"owner": "account_name",
				"quantity": "extended_asset",
				"to": "extended_asset",
				"price": "float64",
				"id": "account_name",
				"memo": "string"
			}
		},
		ctxrecharge: {
			"base": "",
			"action": {
				"name": "ctxrecharge",
				"account": "eosio.token"
			},
			"fields": {
				"owner": "account_name",
				"quantity": "extended_asset",
				"memo": "string"
			}
		},
		ctxextract: {
			"base": "",
			"action": {
				"name": "ctxextract",
				"account": "eosio.token"
			},
			"fields": {
				"owner": "account_name",
				"quantity": "extended_asset",
				"memo": "string"
			}
		},
		ctxtransfer: {
			"base": "",
			"action": {
				"name": "ctxtransfer",
				"account": "eosio.token"
			},
			"fields": {
				"from": "account_name",
				"to": "account_name",
				"quantity": "extended_asset",
				"memo": "string"
			}
		},
		setposition: {
			"base": "",
			"action": {
				"name": "setposition",
				"account": "eosio.token"
			},
			"fields": {
				"sym": "extended_symbol",
				"position": "bool",
				"memo": "string"
			}
		},
		exshare: {
			"base": "",
			"action": {
				"name": "exshare",
				"account": "eosio.token"
			},
			"fields": {
				"quantity": "extended_asset",
				"tosym": "extended_symbol",
				"memo": "string",
			}
		},
		claimbonus: {
			"base": "",
			"action": {
				"name": "claimbonus",
				"account": "eosio"
			},
			"fields": {
				"owner": "account_name"
			}
		},
		exlock: {
			"base": "",
			"action": {
				"name": "exlock",
				"account": "eosio.token"
			},
			"fields": {
				"owner": "account_name",
				"quantity": "extended_asset",
				"expiration": "time_point_sec",
				"memo": "string"
			}
		},
		addreserves: {
			"base": "",
			"action": {
				"name": "addreserves",
				"account:": "eosio.token"
			},
			"fields": {
				"owner": "account_name",
				"tokenx": "extended_asset",
				"tokeny": "extended_asset"
			}
		},
		outreserves: {
			"base": "",
			"action": {
				"name": "outreserves",
				"account:": "eosio.token"
			},
			"fields": {
				"owner": "account_name",
				"x": "extended_symbol",
				"y": "extended_symbol",
				"rate": "float64"
			}
		},
		withdraw: {
			"base": "",
			"action": {
				"name": "withdraw",
				"account:": "eosio.token"
			},
			"fields": {
				"owner":"account_name",
				"x":"extended_symbol",
				"y":"extended_symbol",
				"bid_id":"uint64"
			}
		},
		lockreserve: {
			"base": "",
			"action": {
				"name": "lockreserve",
				"account:": "eosio.token"
			},
			"fields": {
				"owner": "account_name",
				"x": "extended_symbol",
				"y": "extended_symbol"
			}
		},
		unlckreserve: {
			"base": "",
			"action": {
				"name": "unlckreserve",
				"account:": "eosio.token"
			},
			"fields": {
				"owner": "account_name",
				"x": "extended_symbol",
				"y": "extended_symbol"
			}
		}
	});

	var keyPrefix = config && config.keyPrefix ? config.keyPrefix : 'FO';

	var ecc = eosjs.modules.ecc;

	if(!ecc.isPatched || ecc.isPatched <= 2){
		ecc.isPatched = ecc.isPatched ? ecc.isPatched++ : 1
		function patchPubKey(pub_key, pubkey_prefix=keyPrefix) {
			let toString = pub_key.toString;
			pub_key.toString = (pubkeyPrefix = pubkey_prefix) => {
				var str = toString(pubkeyPrefix);
				if (str === 'FO859gxfnXyUriMgUeThh1fWv3oqcpLFyHa3TfFYC4PK2HqhToVM')
					return 'EOS859gxfnXyUriMgUeThh1fWv3oqcpLFyHa3TfFYC4PK2HqhToVM';
				return str;
			}
	
			return pub_key;
		}
	
		var privateToPublic = ecc.privateToPublic;
		ecc.privateToPublic = function (wif, pubkey_prefix = keyPrefix) {
			return privateToPublic(wif, pubkey_prefix);
		}
	
		var isValidPublic = ecc.isValidPublic;
		ecc.isValidPublic = function(pubkey, pubkey_prefix=keyPrefix){
			return isValidPublic(pubkey, pubkey_prefix)
		}

		var PubKey = ecc.PublicKey;
		ecc.PublicKey = (Q, pubkey_prefix=keyPrefix) => {
			return patchPubKey(PubKey(Q, pubkey_prefix), pubkey_prefix);
		}

		var fromPoint = PubKey.fromPoint;
		PubKey.fromPoint = function (Q) {
			return patchPubKey(fromPoint(Q));
		};
	
		var fromBuffer = PubKey.fromBuffer;
		PubKey.fromBuffer = function (buffer, pubkey_prefix=keyPrefix) {
			return patchPubKey(fromBuffer(buffer), pubkey_prefix);
		};
	
		var fromString = PubKey.fromString;
		PubKey.fromString = function (public_key, pubkey_prefix = keyPrefix) {
			return fromString(public_key, pubkey_prefix);
		}
	
		var fromStringOrThrow = PubKey.fromStringOrThrow;
		PubKey.fromStringOrThrow = function (public_key, pubkey_prefix = keyPrefix) {
			if (public_key === 'EOS859gxfnXyUriMgUeThh1fWv3oqcpLFyHa3TfFYC4PK2HqhToVM')
				public_key = 'FO859gxfnXyUriMgUeThh1fWv3oqcpLFyHa3TfFYC4PK2HqhToVM';
			return fromStringOrThrow(public_key, pubkey_prefix);
		};
	
		// patch signature
		var ecdsa = require('eosjs-ecc/lib/ecdsa');
		var hash = require('eosjs-ecc/lib/hash');
		var curve = require('ecurve').getCurveByName('secp256k1');

		function patchSignature(signature) {

			signature.verifyHash = (dataSha256, pubkey, encoding='hex', pubkey_prefix=keyPrefix) => {
				if (typeof dataSha256 === 'string') {
						dataSha256 = Buffer.from(dataSha256, encoding);
				}
				if (dataSha256.length !== 32 || !Buffer.isBuffer(dataSha256)) throw new Error("dataSha256: 32 bytes required");
				var publicKey = ecc.PublicKey(pubkey, pubkey_prefix);
				assert(publicKey, 'pubkey required');

				return ecdsa.verify(curve, dataSha256, { r: signature.r, s: signature.s }, publicKey.Q);
			}
			signature.verify = function(data, pubkey, encoding='utf8', pubkey_prefix=keyPrefix) {
				if (typeof data === 'string') {
					data = Buffer.from(data, encoding);
				}
				assert(Buffer.isBuffer(data), 'data is a required String or Buffer');
				data = hash.sha256(data);
				return signature.verifyHash(data, pubkey, 'hex', pubkey_prefix);
			}

			return signature;
		}

		var Signature = ecc.Signature;

		var signatureFromBuffer = Signature.fromBuffer;
		Signature.fromBuffer = function(buf){
			return patchSignature(signatureFromBuffer(buf))
		}

		ecc.verify = function(signature, data, pubkey, encoding='utf8', pubkey_prefix=keyPrefix) {
			if (encoding === true) {
					throw new TypeError('API changed, use verifyHash(..) instead');
			} else {
					if (encoding === false) {
							console.log('Warning: ecc.verify hashData parameter was removed');
					}
			}
			signature = Signature.from(signature);
			return signature.verify(data, pubkey, encoding, pubkey_prefix);
		}

		ecc.verifyHash = function(signature, dataSha256, pubkey, encoding='hex', pubkey_prefix=keyPrefix) {
			signature = Signature.from(signature);
			return signature.verifyHash(dataSha256, pubkey, encoding, pubkey_prefix);
		}

		ecc.recover = function(signature, data, encoding='utf8', pubkey_prefix=keyPrefix) {
			if (encoding === true) {
					throw new TypeError('API changed, use recoverHash(signature, data) instead');
			} else {
					if (encoding === false) {
							console.log('Warning: ecc.recover hashData parameter was removed');
					}
			}
			signature = Signature.from(signature);
			return signature.recover(data, encoding).toString(pubkey_prefix);
		}

		ecc.recoverHash = function(signature, dataSha256, encoding='hex', pubkey_prefix=keyPrefix) {
			signature = Signature.from(signature);
			return signature.recoverHash(dataSha256, encoding).toString(pubkey_prefix);
		}
	}

	return eosjs;
};
