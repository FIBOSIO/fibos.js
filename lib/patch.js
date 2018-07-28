var util = require('util');

module.exports = function(eosjs) {
	var fibos = (config) => {
		let eos = eosjs(config);
		for (var k in eos) {
			if (typeof eos[k] === "function") {
				eos[`${k}Sync`] = util.sync(eos[k]);
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