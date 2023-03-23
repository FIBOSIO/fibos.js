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

const cache = new util.LruCache(256, 1000);
const locker = {};
const waiter = {};

const get_info = JsonRpc.prototype.get_info;
JsonRpc.prototype.get_info = function () {
    return new Promise((resolve, reject) => {
        var k = this.endpoint;
        var res = cache.get(k);
        if (res) {
            resolve(res);
            return;
        }

        var wait = false;
        var l = waiter[k];
        if (!l)
            l = waiter[k] = [];
        else
            wait = true;

        l.push(function (err, res) {
            if (err)
                reject(err);
            else
                resolve(res);
        });

        if (!wait)
            get_info.call(this).then(res => {
                delete waiter[k];
                cache.set(k, res);

                for (var i = 0; i < l.length; i++)
                    l[i](null, res);
            }).catch(err => {
                delete waiter[k];

                for (var i = 0; i < l.length; i++)
                    l[i](err);
            });
    });
};

const get_block_info = JsonRpc.prototype.get_block_info;
JsonRpc.prototype.get_block_info = function (blockNum) {
    return new Promise((resolve, reject) => {
        var k = `${this.endpoint}#${blockNum}`;
        var res = cache.get(k);
        if (res) {
            resolve(res);
            return;
        }

        var wait = false;
        var l = waiter[k];
        if (!l)
            l = waiter[k] = [];
        else
            wait = true;

        l.push(function (err, res) {
            if (err)
                reject(err);
            else
                resolve(res);
        });

        if (!wait)
            get_block_info.call(this, blockNum).then(res => {
                delete waiter[k];
                cache.set(k, res);

                for (var i = 0; i < l.length; i++)
                    l[i](null, res);
            }).catch(err => {
                delete waiter[k];

                for (var i = 0; i < l.length; i++)
                    l[i](err);
            });
    });
};

const getRequiredKeys = JsonRpc.prototype.getRequiredKeys;
JsonRpc.prototype.getRequiredKeys = function (args) {
    if (args.availableKeys.length = 1)
        return Promise.resolve([args.availableKeys[0]]);
    return getRequiredKeys.call(this, args);
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
