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
            act.abi = _func;
        }
    }

    return new Promise((resolve, reject) => {
        transact.call(this, trans, opts)
            .then(result => {
                for (var i = 0; i < trans.actions.length; i++) {
                    var act = trans.actions[i];
                    if (act.abi && act.abi.outputs.length) {
                        try {
                            var hex_data = "0x" + result.processed.action_traces[i].return_value_hex_data;
                            result.processed.action_traces[i].return_value = Web3EthAbi.decodeParameter(act.abi.outputs[0], hex_data);
                        } catch (e) { }
                    }
                }
                return resolve(result);
            })
            .catch(reject);
    });
}