const assert = require('assert')
const test = require("test");
const FIBOSJS = require('../');
const ecc = FIBOSJS.modules.ecc;

const config = {
	chainId: "5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191",
	httpEndpoint: "http://api-kylin.fibos.testnet.fo:7070",
	account: "testtesteos1",
	active_key: {
		"public": "EOS82K1EQS1JKWkkt486HkRL7UfxAeGR74jqaSxU7iqd1JRHktL7B",
		"private": "5KTRWc6fpCzQ9NhgFNA6CX8A6QUZSa38DavCaNrAnTSRKWQEWK8"
	},
	owner_key: {
		"public": "EOS81n7RqeA5AbF1DMVFQWGKd1zrJ3N6cynEgLMTjaXLa17TpP1SE",
		"private": "5JJt2mRDnYrEeEZFkHrDmPaXpNmiRbmzisRULbFQR5wCE9FkRAo"
	},
	account2: 'testtesteos2',
	"active_key2": {
		"public": "EOS5qtFtTeZcse5GFZ2fYjZ1VJmARqm7TXcgALa7TcTLr6meBoALA",
		"private": "5KAExNRZSEFxUrgJGcRJeTQvXkG9zbaCPx4KEbvmPZ2fMD96UoG"
	},
	"owner_key2": {
		"public": "EOS7Hct6BEJA55QSKMpq2YfNeBZoFBzCwPo2qgtibNFxuiF5Kv34w",
		"private": "5Kfk5MAg7jJTKFCekpo2X3T1uLnV2rmDZmgy3xRX3AKRTjm6L9h"
	}
};

describe('eos tool', () => {
	var fibos;
	before(() => {
		FIBOSJS.setPrefix("EOS");
		fibos = FIBOSJS({
			chainId: config.chainId,
			keyProvider: [config.active_key.private, config.active_key2.private],
			httpEndpoint: config.httpEndpoint,
			logger: {
				log: null,
				error: null
			}
		});
	});

	it('randomKey to pubkey EOS', () => {
		var pubkey = ecc.privateToPublic(ecc.randomKeySync());
		assert.equal(pubkey.substr(0, 3), 'EOS');
	})

	it('transfer', () => {
		var ctx = fibos.contractSync("eosio.token");

		ctx.transferSync('testtesteos1', 'testtesteos2', "10.0000 EOS", 'enjoy yourself', {
			authorization: 'testtesteos1@active'
		});

		ctx.transferSync('testtesteos2', 'testtesteos1', "10.0000 EOS", '3ks, you too', {
			authorization: 'testtesteos2@active'
		});
	});

	after(() => {
		FIBOSJS.setPrefix("FO");
	})

})