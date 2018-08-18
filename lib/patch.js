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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	return typeof obj;
} : function (obj) {
	return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var _slicedToArray = function () {
	function sliceIterator(arr, i) {
		var _arr = [];
		var _n = true;
		var _d = false;
		var _e = undefined;
		try {
			for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
				_arr.push(_s.value);
				if (i && _arr.length === i) break;
			}
		} catch (err) {
			_d = true;
			_e = err;
		} finally {
			try {
				if (!_n && _i["return"]) _i["return"]();
			} finally {
				if (_d) throw _e;
			}
		}
		return _arr;
	}
	return function (arr, i) {
		if (Array.isArray(arr)) {
			return arr;
		} else if (Symbol.iterator in Object(arr)) {
			return sliceIterator(arr, i);
		} else {
			throw new TypeError("Invalid attempt to destructure non-iterable instance");
		}
	};
}();

module.exports = function (eosjs) {
	var ecc = eosjs.modules.ecc;

	function patchPubKey(pub_key) {
		pub_key.toString = () => {
			var str = 'FO' + ecc.key_utils.checkEncode(pub_key.toBuffer());
			if (str === 'FO859gxfnXyUriMgUeThh1fWv3oqcpLFyHa3TfFYC4PK2HqhToVM')
				return 'EOS859gxfnXyUriMgUeThh1fWv3oqcpLFyHa3TfFYC4PK2HqhToVM';
			return str;
		}

		return pub_key;
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

	PubKey.fromStringOrThrow = function (public_key) {
		assert.equal(typeof public_key === 'undefined' ? 'undefined' : _typeof(public_key), 'string', 'public_key');
		var match = public_key.match(/^PUB_([A-Za-z0-9]+)_([A-Za-z0-9]+)$/);
		if (match === null) {
			if (public_key === 'EOS859gxfnXyUriMgUeThh1fWv3oqcpLFyHa3TfFYC4PK2HqhToVM')
				public_key = 'FO859gxfnXyUriMgUeThh1fWv3oqcpLFyHa3TfFYC4PK2HqhToVM';

			// legacy
			if (/^FO/.test(public_key))
				public_key = public_key.substring(2);

			return ecc.PublicKey.fromBuffer(ecc.key_utils.checkDecode(public_key));
		}
		assert(match.length === 3, 'Expecting public key like: PUB_K1_base58pubkey..');

		var _match = _slicedToArray(match, 3),
			keyType = _match[1],
			keyString = _match[2];

		assert.equal(keyType, 'K1', 'K1 private key expected');
		return ecc.PublicKey.fromBuffer(ecc.key_utils.checkDecode(keyString, keyType));
	};

	Object.assign(
		ecc.PublicKey,
		PubKey
	);

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