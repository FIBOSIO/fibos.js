# FIBOS.JS

[![NPM version][npm-image]][npm-url]

General purpose library for FIBOS and EOSIO blockchains.

## Geting Started

Install the module with:

```
npm install fibos.js
```

Starting FIBOS&EOSIO blockchains journey with fibos.js:

```
var FIBOSJS = require('fibos.js')

config = {
	chainId: 'Chain ID', // 32 byte (64 char) hex string
	keyProvider: ['PrivateKey'], // WIF string or array of keys..
	httpEndpoint: 'http://127.0.0.1:8888',
	expireInSeconds: 60,
	broadcast: true,
	verbose: false, // API activity
	sign: true
}

var fibos = FIBOSJS(config);
```

## Test

```
npm test
```

## BLOCKCHAIN Support

- [FIBOS](https://fibos.io/)
- [EOSIO](https://eos.io/)

## Features

fibos.js adds a set of synchronous version method on [eosjs](https://github.com/EOSIO/eosjs).

## Documentation

Compared with [eosjs](https://github.com/EOSIO/eosjs), fibos.js did not add new functions, the developer documentation can refer to eosjs. You could find all functions on [eosjs project page](https://github.com/EOSIO/eosjs). For fibos.js, the only thing you need to do is to switch those awful asynchronous function calls to the synchronous version.

For example,

```
// old-fashioned
fibos.getInfo((error, result) => { console.log(error, result) })

// stylish usage
var chainId = fibos.getInfoSync().chain_id;
```

Also, you could find use cases in `test/test.js`. With these cases, you will find out the parameters you should pass and the return values you expected.

At the moment, preliminary development on fibos.js has been completed, but there are still a lot of work to be done, such as improving the use cases. After that, you will see more advancing usages with fibos.js.

## API Usage

### General Configuration Before Use API

```
var FIBOS = require('fibos.js');
var config = {
	"chainId": "Chain ID",// 32 byte (64 char) hex string
	"producer-name": "eosio",
	"public-key": "producer public key ",
	"private-key": "producer private key",
	"httpEndpoint": "http://127.0.0.1:8888",
};

var fibos = FIBOS({
	chainId: config["chainId"],
	keyProvider: config["private-key"],
	httpEndpoint: config["httpEndpoint"],
	logger: {
		log: null,
		error: null
	}
});
```

### 1.Get Block Info

```
fibos.getBlockSync("block_number");
```

### 2.Get Head_Block Number

```
fibos.getInfoSync().head_block_num;
```

### 3.Get Last_Irreversiable_Block Number

```
fibos.getInfoSync().last_irreversible_block_num;
```

### 4.Create A New FIBOS Account

```
fibos.newaccountSync({
    creator: 'eosio',
    name: "hellomongodb",
    owner: config["public-key"],
    active: config["public-key"]
});
```

### 5.Get Account Balance

```
For FIBOS Network:

When you can get account balance,token name must be with suffix.("EOS@eosio")

fibos.getCurrencyBalanceSync("eosio.token", "your acount name", "EOS@eosio");

For EOS Network:

fibos.getCurrencyBalanceSync("eosio.token", "your acount name", "EOS");
```

### 6.Get Account Info

```
fibos.getAccountSync(account);
```

### 7.Make a successful transfer

```
var ctx = fibos.contractSync("eosio.token");
api1: ctx.transferSync(from, to, quality, memo);
api2: ctx.extransferSync(from, to, quality, memo, {
			authorization: from
		});
```

### 8.Generate FIBOS publickey and privatekey

```
var privateKey = fibos.modules.ecc.randomKeySync();//privateKey 
fibos.modules.ecc.privateToPublic(privateKey);//publickey
```

### 9.Token contract api

There are two kinds of token in FIBOS : classic token and smart token .

#### 1). create token

**接口**

```
excreateSync(issuer, maximum_supply,  connector_weight, maximum_exchange,reserve_supply, reserve_connector_balance, {
    authorization: issuer
});
```

**参数解释**

| 参数                      | 含义                                                   |
| ------------------------- | ------------------------------------------------------ |
| issuer                    | 通证发行者                                             |
| maximum_supply            | 最大可发行通证数量                                     |
| connector_weight          | 连接器权重（值为0时表示为普通通证，0-1之间为智能通证） |
| maximum_exchange          | 最大可兑换(流通)的通证数量                             |
| reserve_supply            | 未流通通证数量                                         |
| reserve_connector_balance | 未流通通证保证金数量                                   |

**实例**

```js
//初始化 fibos 客户端
...
let name = "fibostest123";
let ctx = fibos.contractSync("eosio.token");
let r = ctx.excreateSync(name, "100000000000.0000 AAA",  0.15,'10000000000.0000 AAA', '3000000000.0000 AAA', '90000.0000 FO', {
    authorization: name
});
console.log(r);excreateSync(issuer, maximum_supply,  connector_weight, maximum_exchange,reserve_supply, reserve_connector_balance, {
    authorization: issuer
});
```

#### 2).issue token

**接口**

```
exissueSync(to, quality, memo, {
				authorization: issuer
			})
```

**参数解释**

| 参数          | 含义             |
| ------------- | ---------------- |
| to            | 增发通证接收账号 |
| quality       | 数量             |
| memo          | 附言             |
| authorization | 发行方           |

**实例**

```js
//初始化 fibos 客户端
...
let name = "fibostest123";
let ctx = fibos.contractSync("eosio.token");
let r = ctx.exissueSync(name, "1000000.0000 ABC", "issue to fibostest123", {
				authorization: name
			})
console.log(r);
```

> 只有普通通证支持增发

#### 3).retire token

**接口**

```
exretireSync(from, quantity, memo, {
				authorization: from
			});
```

**参数解释**

| 参数          | 含义             |
| ------------- | ---------------- |
| from          | 销毁通证接收账号 |
| quality       | 数量             |
| memo          | 附言             |
| authorization | 销毁通证账号权限 |

**实例**

```js
//初始化 fibos 客户端
...
let name = "fibostest123";
let ctx = fibos.contractSync("eosio.token");
let r = ctx.exretireSync(name, "1000000.0000 ABC", "retire token", {
				authorization: name
			})
console.log(r);
```

#### 4).close token

**接口**

```
exissueSync(owner, symbol, {
				authorization: owner
			})
```

**参数解释**

| 参数          | 含义               |
| ------------- | ------------------ |
| owner         | 通证持有者账号     |
| symbol        | 通证代号           |
| authorization | 通证持有者账号权限 |

**实例**

```js
//初始化 fibos 客户端
...
let owner = "fibostest123";
let ctx = fibos.contractSync("eosio.token");
let r = ctx.exissueSync(owner, "0.0000 ABC", {
				authorization: owner
			})
console.log(r);
```

#### 5).destory token

**接口**

```
exdestroySync(symbol, {
				authorization: issuer
			})
```

**参数解释**

| 参数          | 含义           |
| ------------- | -------------- |
| symbol        | 通证符号       |
| authorization | 通证发行者权限 |

**实例**

```js
//初始化 fibos 客户端
...
let issuer = "fibostest123";
let ctx = fibos.contractSync("eosio.token");
let r = ctx.exdestroySync("0.0000 ABC", {
				authorization: issuer
			})
console.log(r);
```

### 10.To be continued...

If you want get more api usage or use FIBOS node service，please go to [fibos.io](https://fibos.io/) !



## License

fibos.js is [MIT licensed](https://github.com/fibos/fibos.js/blob/master/LICENSE).
