const FIBOSJS = require('../');
const ecc = FIBOSJS.modules.ecc;

describe('fo', () => {
    it('randomKey to pubkey FO', () => {
        var pubkey = ecc.privateToPublic(ecc.randomKeySync());
        assert.equal(pubkey.substr(0, 2), 'FO');
    })
})