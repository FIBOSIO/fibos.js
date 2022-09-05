const { JsonRpc } = require('eosjs');
var util = require('util');
var io = require('io');
var zip = require('zip');
var fs = require('fs');
var path = require('path');

var async_protos = {
    Api: [
        "getCachedAbi",
        "getAbi",
        "getTransactionAbis",
        "getContract",
        "serializeActions",
        "deserializeActions",
        "deserializeTransactionWithActions",
        "transact",
        "query",
        "pushSignedTransaction",
        "pushCompressedSignedTransaction"
    ],
    JsonRpc: [
        "fetch",
        "abi_bin_to_json",
        "abi_json_to_bin",
        "get_abi",
        "get_account",
        "get_accounts_by_authorizers",
        "get_activated_protocol_features",
        "get_block_header_state",
        "get_block_info",
        "get_block",
        "get_code",
        "get_code_hash",
        "get_currency_balance",
        "get_currency_stats",
        "get_info",
        "get_producer_schedule",
        "get_producers",
        "get_raw_code_and_abi",
        "getRawAbi",
        "get_raw_abi",
        "get_scheduled_transactions",
        "get_table_rows",
        "get_kv_table_rows",
        "get_table_by_scope",
        "getRequiredKeys",
        "push_transaction",
        "push_ro_transaction",
        "push_transactions",
        "send_transaction",
        "db_size_get",
        "trace_get_block",
        "history_get_actions",
        "history_get_transaction",
        "history_get_key_accounts",
        "history_get_controlled_accounts"
    ]
};

var async_modules = {
    ecc: [
        "randomKey"
    ]
};

module.exports = function (eosjs) {
    for (var m in async_protos) {
        var mod = eosjs[m].prototype;
        async_protos[m].forEach(a => mod[a + '_sync'] = util.sync(mod[a], true));
    }

    for (var m in async_modules) {
        var mod = eosjs[m];
        async_modules[m].forEach(a => mod[a + '_sync'] = util.sync(mod[a], true));
    }

    eosjs.Api.prototype.compileModule = function (fname) {
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

    eosjs.Api.prototype.compileCode = function (code) {
        var stm = new io.MemoryStream();
        var zf = zip.open(stm, "w");
        zf.write(new Buffer(code), 'index.js');
        zf.close();

        stm.rewind();

        return stm.readAll();
    };

}
