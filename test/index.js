var FIBOSJS = require('..')

config = {
	chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca', // 32 byte (64 char) hex string
	keyProvider: ['5KSj9qxH3A9zRzs2Cspv2jStdhZ8dMCgmQG4BCkp57s8Y5zYET3'], // WIF string or array of keys..
	httpEndpoint: 'http://115.47.152.177:8888',
	expireInSeconds: 60,
	broadcast: true,
	verbose: false, // API activity
	sign: true
}

var fibosjs = FIBOSJS(config);

var test = require("test");

test.setup();

describe("fibos.js: ", () => {

	it("getInfoSync() should return info of the blockchain", () => {
		assert.ok(fibosjs.getInfoSync().chain_id != null);
	});
	it("getBlockSync('100') should return info of specific block", () => {
		assert.ok(fibosjs.getBlockSync(100).block_num == 100);
	});
	it("getAccountSync('d3jeostest22') should return account info of specific account", () => {
		assert.ok(fibosjs.getAccountSync('d3jeostest22').account_name == 'd3jeostest22');
	});
	it("getCodeSync('eosio') should return contract info of specific account", () => {
		assert.ok(fibosjs.getCodeSync("d3jeostest22").account_name == "d3jeostest22");
	});
	it("getCurrencyBalanceSync('eosio.token','d3jeostest22') should return the balance of specific account", () => {
		assert.ok(fibosjs.getCurrencyBalanceSync("eosio.token", "d3jeostest22") != null);
	});
	it("getCurrencyBalance('eosio.token','d3jeostest22', 'eos') should return EOS balance of pecific account", () => {
		assert.ok(fibosjs.getCurrencyBalanceSync("eosio.token", "d3jeostest22", 'eos').toString().indexOf("EOS") != -1)
	});
	it("getCurrencyStatsSync('eosio.token', 'eos') should return EOS currency states", () => {
		assert.ok(fibosjs.getCurrencyStatsSync("eosio.token", "eos").EOS.issuer == "eosio");
	});
	it("getProducersSync(false, '', 5) should return producer list", () => {
		assert.ok(fibosjs.getProducersSync(false, '', 5).rows.length == 5);
	});
	it("getProducersSync(true, '', 5) should return producer list in json format", () => {
		assert.ok(fibosjs.getProducersSync(true, '', 10).rows.length == 10);
	});
	it("getTableRowsSync('d3jeostest22', 'eosio.token', 'accounts', false) should return table raws", () => {
		assert.ok(fibosjs.getTableRowsSync(false, "eosio.token", "d3jeostest22", "accounts").rows != null);
	});
	it("getTableRowsSync('d3jeostest22', 'eosio.token', 'accounts', false) should return table raws", () => {
		assert.ok(fibosjs.getTableRowsSync(true, "eosio.token", "d3jeostest22", "accounts").rows != null);
	});
	it("abiJsonToBinSync('eosio.token', 'transfer', args) should return hex data for push_transaction", () => {
		let args = {
			"from": "d3jeostest22",
			"to": "d3jeostest22",
			"quantity": "1 EOS",
			"memo": "hi"
		};
		assert.ok(fibosjs.abiJsonToBinSync("eosio.token", "transfer", args).binargs != null);
	});
	it("abiBinToJsonSync('eosio.token', 'transfer', 'hexdata') should return json data", () => {
		assert.ok(fibosjs.abiBinToJsonSync("eosio.token", "transfer", "2044c62a63aade482044c62a63aade48010000000000000000454f5300000000026869").args.from == "d3jeostest22");
	});

});

test.run();