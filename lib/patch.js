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
	var ecc = eosjs.modules.ecc;

	function patchPubKey(pub_key) {
		let toString = pub_key.toString;
		pub_key.toString = () => {
			var str = toString('FO');
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

	let fromStringOrThrow = PubKey.fromStringOrThrow;
	PubKey.fromStringOrThrow = function (public_key) {
		if (public_key === 'EOS859gxfnXyUriMgUeThh1fWv3oqcpLFyHa3TfFYC4PK2HqhToVM')
			public_key = 'FO859gxfnXyUriMgUeThh1fWv3oqcpLFyHa3TfFYC4PK2HqhToVM';
		return fromStringOrThrow(public_key, 'FO');
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