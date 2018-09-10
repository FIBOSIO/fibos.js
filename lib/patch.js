var is_fibjs = false;
var BigNumber = require('bignumber.js')

try {
	is_fibjs = !!process.versions.fibjs
} catch (e) {}

var patch_api = require('./patch_api');

function patch_sync(eosjs) {
	var util = require('util');
	var io = require('io');
	var fs = require('fs');
	var path = require('path');
	var zip = require('zip');

	var ecc = eosjs.modules.ecc;

	ecc.randomKeySync = util.sync(ecc.randomKey, true);
	ecc.unsafeRandomKeySync = util.sync(ecc.unsafeRandomKey, true);
	ecc.PrivateKey.randomKeySync = util.sync(ecc.PrivateKey.randomKey, true);

	eosjs.modules.string2name = function(str) {
		function char_to_symbol(c) {
			if (c >= 97 && c <= 122)
				return (c - 97) + 6;

			if (c >= 49 && c <= 53)
				return (c - 49) + 1;

			return 0;
		}

		let len = str.length

		let value = new BigNumber(0)

		for (let i = 0; i <= 12; ++i) {
			let c = 0;
			if (i < len && i <= 12) {
				c = char_to_symbol(str.charCodeAt(i))
			}

			if (i < 12) {
				c &= 0x1f;
				let b_c = new BigNumber(c)
				let two = new BigNumber(2)
				b_c = b_c.times(two.pow(64 - 5 * (i + 1)))
				value = value.plus(b_c);
			} else {
				c &= 0x0f;
				value = value.plus(c);
			}
		}

		return value.toFixed();
	}

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

		eos.getCurrencyBalanceSync = (code, account, symbol) => {

			// eos network
			if (symbol.indexOf("@") === -1)
				return eos.getCurrencyBalanceSync(code, account, symbol);

			// fibos network
			let rows = [];
			let lower_bound = 0;
			let limit = 50;
			let result = [];

			account = eosjs.modules.string2name(account);

			while (true) {
				let rs = eos.getTableRowsSync({
					json: true,
					code: code,
					scope: account,
					table: "accounts",
					lower_bound: lower_bound,
					upper_bound: -1,
					limit: limit
				});

				result = rs.rows.filter(function(d) {
					let prefix = d.balance.quantity.split(" ")[1];
					let contract = d.balance.contract;

					return (prefix + "@" + contract) === symbol;
				});

				if (result.length === 1) break;

				rows = rows.concat(rs.rows);

				lower_bound = lower_bound + limit;

				if (!rs.more) break;
			}

			if (result.length === 1) result = [{
				balance: result[0].balance.quantity + "@" + result[0].balance.contract
			}]

			return {
				rows: result,
				more: false
			};
		};

		return eos;
	};



	Object.assign(
		fibos,
		eosjs
	);

	return fibos;
}

module.exports = function(eosjs) {
	eosjs = patch_api(eosjs);

	if (!is_fibjs)
		return eosjs;

	return patch_sync(eosjs);
}