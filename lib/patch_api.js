const Web3EthAbi = require('web3-eth-abi');
const rlp = require("@ethersproject/rlp");
var Api = require('eosjs/dist/eosjs-api').Api;
var ser = require('eosjs/dist/eosjs-serialize');

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
                    if (act.abi) {
                        var act_result = result.processed.action_traces[i];

                        if (act_result.console.length) {
                            var hex_logs = "0x" + act_result.console;
                            try {
                                act_result.logs = rlp.decode(hex_logs);
                            } catch (e) { }
                        }

                        if (act.abi.outputs.length && act_result.return_value_hex_data.length) {
                            var hex_data = "0x" + act_result.return_value_hex_data;
                            try {
                                act_result.return_value = Web3EthAbi.decodeParameter(act.abi.outputs[0], hex_data);
                            } catch (e) { }
                        }

                    }
                }
                return resolve(result);
            })
            .catch(reject);
    });
}

Api.prototype.addr2name = function (addr) {
    var buffer = new ser.SerialBuffer();
    buffer.pushArray(Buffer.from(addr.substr(26), 'hex').reverse());
    return buffer.getName();
}

Api.prototype.name2addr = function (name) {
    var buffer = new ser.SerialBuffer();
    buffer.pushName(name);
    return "0x000000000000000000000000" + ser.arrayToHex(buffer.asUint8Array().reverse());
}
