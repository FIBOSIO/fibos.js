const FIBOSJS = require('../');
const string2name = FIBOSJS.modules.string2name;

describe('get_currency_balance', () => {

	it('string2name', () => {
		var uint64Value = string2name("eosio");

		assert.equal(uint64Value, '6138663577826885632');
	});
});