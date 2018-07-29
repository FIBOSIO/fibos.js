var util = require('util');
var io = require('io');
var fs = require('fs');
var path = require('path');
var zip = require('zip');

module.exports = function(eosjs) {
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

	eosjs.modules.ecc.randomKeySync = util.sync(eosjs.modules.ecc.randomKey, true);
	eosjs.modules.ecc.unsafeRandomKeySync = util.sync(eosjs.modules.ecc.unsafeRandomKey, true);
	eosjs.modules.ecc.PrivateKey.randomKeySync = util.sync(eosjs.modules.ecc.PrivateKey.randomKey, true);
	Object.assign(
		fibos,
		eosjs
	);

	return fibos;
}