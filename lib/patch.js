var is_fibjs = false;

try {
	is_fibjs = !!process.versions.fibjs
} catch (e) {}

if (is_fibjs) {
	var util = require('util');
	var io = require('io');
	var fs = require('fs');
	var path = require('path');
	var zip = require('zip');
}

module.exports = function (eosjs) {
	Object.assign(eosjs.modules.json.schema, {
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
				"reserve_connector_balance": "asset"
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
				"tosym": "extended_symbol",
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
	});

	var ecc = eosjs.modules.ecc;

	function patchPubKey(pub_key) {
		let toString = pub_key.toString;
		pub_key.toString = (pubkey_prefix = 'FO') => {
			var str = toString(pubkey_prefix);
			if (str === 'FO859gxfnXyUriMgUeThh1fWv3oqcpLFyHa3TfFYC4PK2HqhToVM')
				return 'EOS859gxfnXyUriMgUeThh1fWv3oqcpLFyHa3TfFYC4PK2HqhToVM';
			return str;
		}

		return pub_key;
	}

	var privateToPublic = ecc.privateToPublic;
	ecc.privateToPublic = function (wif, pubkey_prefix = 'FO') {
		return privateToPublic(wif, pubkey_prefix);
	}

	var PubKey = ecc.PublicKey;
	ecc.PublicKey = Q => {
		return patchPubKey(PubKey(Q));
	}

	var fromPoint = PubKey.fromPoint;
	PubKey.fromPoint = function (Q) {
		return patchPubKey(fromPoint(Q));
	};

	var fromBuffer = PubKey.fromBuffer;
	PubKey.fromBuffer = function (buffer) {
		return patchPubKey(fromBuffer(buffer));
	};

	var fromString = PubKey.fromString;
	PubKey.fromString = function (public_key, pubkey_prefix = 'FO') {
		return fromString(public_key, pubkey_prefix);
	}

	var fromStringOrThrow = PubKey.fromStringOrThrow;
	PubKey.fromStringOrThrow = function (public_key, pubkey_prefix = 'FO') {
		if (public_key === 'EOS859gxfnXyUriMgUeThh1fWv3oqcpLFyHa3TfFYC4PK2HqhToVM')
			public_key = 'FO859gxfnXyUriMgUeThh1fWv3oqcpLFyHa3TfFYC4PK2HqhToVM';
		return fromStringOrThrow(public_key, pubkey_prefix);
	};

	if (!is_fibjs)
		return eosjs;

	ecc.randomKeySync = util.sync(ecc.randomKey, true);
	ecc.unsafeRandomKeySync = util.sync(ecc.unsafeRandomKey, true);
	ecc.PrivateKey.randomKeySync = util.sync(ecc.PrivateKey.randomKey, true);

	var fibos = (config) => {
		let eos = eosjs(config);
		for (var k in eos) {
			if (typeof eos[k] === "function") {
				eos[`${k}Sync`] = (k === "transaction") ? util.sync(eos[k], true) : util.sync(eos[k]);
			}
		}

		eos._contractSync = eos.contractSync;
		eos.contractSync = account => {
			var ctx = eos._contractSync(account);
			for (var k in ctx) {
				if (typeof ctx[k] === "function") {
					ctx[`${k}Sync`] = util.sync(ctx[k]);
				}
			}

			return ctx;
		};

		eos.compileModule = fname => {
			var stm = new io.MemoryStream();
			var zf = zip.open(stm, "w");

			function append(fname, base) {
				var files = fs.readdir(fname);

				files.forEach(file => {
					var fpath = path.join(fname, file);
					if (fs.stat(fpath).isDirectory())
						append(fpath, path.join(base, file));
					else
						zf.write(fs.readFile(fpath), path.join(base, file));
				});
			}

			append(fname, "");

			zf.close();
			stm.rewind();

			return stm.readAll();
		};

		eos.compileCode = code => {
			var stm = new io.MemoryStream();
			var zf = zip.open(stm, "w");
			zf.write(new Buffer(code), 'index.js');
			zf.close();

			stm.rewind();

			return stm.readAll();
		};

		return eos;
	};

	Object.assign(
		fibos,
		eosjs
	);

	return fibos;
}