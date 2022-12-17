const Web3EthAbi = require('web3-eth-abi');
var Api = require('eosjs/dist/eosjs-api').Api;

var transact = Api.prototype.transact;
Api.prototype.transact = function (trans, opts) {
    for (var i = 0; i < trans.actions.length; i++) {
        var act = trans.actions[i];
        var solidity = act.solidity;

        if (solidity) {
            var _func = undefined;

            for (var f = 0; f < solidity.length; f++) {
                var func = solidity[f];
                if (func.type == 'function' && func.name == act.name) {
                    _func = func;
                    break;
                }
            }

            if (!_func)
                throw new Error('Unknown action ' + act.name + ' in contract ' + act.account);

            var params = [];
            _func.inputs.forEach(p => params.push(act.data[p.name]));

            var data = Web3EthAbi.encodeFunctionCall(_func, params).slice(2);
            act.data = { data };
            act.name = '';
        }
    }

    return transact.call(this, trans, opts);
}