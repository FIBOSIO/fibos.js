# FIBOS.JS

General purpose library for FIBOS and EOSIO blockchains.

## Geting Started

Install the module with:

```sh
npm install fibos.js
```

Starting FIBOS&EOSIO blockchains journey with fibos.js:

```javascript
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

```sh
npm test
```

## BLOCKCHAIN Support

- [FIBOS](https://fibos.io)
- [EOSIO](https://eos.io/)

## Features

fibos.js adds a set of synchronous version method on [eosjs](https://github.com/EOSIO/eosjs).

## Documentation

Compared with [eosjs](https://github.com/EOSIO/eosjs), fibos.js did not add new functions, the developer documentation can refer to eosjs. You could find all functions on [eosjs project page](https://github.com/EOSIO/eosjs). For fibos.js, the only thing you need to do is to switch those awful asynchronous function calls to the synchronous version. 

For example,

```javascript
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

```js
fibos.getBlockSync("block_number");
```

### 2.Get Head_Block Number

```js
fibos.getInfoSync().head_block_num;
```

### 3.Get Last_Irreversiable_Block Number

```js
fibos.getInfoSync().last_irreversible_block_num;
```

### 4.Create A New FIBOS Account

```js
fibos.newaccountSync({
    creator: 'eosio',
    name: "hellomongodb",
    owner: config["public-key"],
    active: config["public-key"]
});
```

### 5.Get Account Balance

```js
fibos.getTableRowsSync(true, "eosio.token", account, "accounts")
```

### 6.Get Account Info

```js
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

```js
var privateKey = fibos.modules.ecc.randomKeySync();//privateKey 
fibos.modules.ecc.privateToPublic(privateKey);//publickey
```

### 9.Token contract api

There are two kinds of token in FIBOS : classic token and smart token .

  #### 1). create token

```js
let ctx = fibos.contractSync("eosio.token");
ctx.excreateSync(issuer, maximum_supply,  connector_weight, maximum_exchange,reserve_supply, reserve_connector_balance, {
    authorization: issuer
});
```

> Tips:when the connector_weight's value is 0 , this token is classic token ,while between 0 and 1 , it is smart token. If it is smart token ,you must calculate reserve_supply and reserve_connector_balance according to [bancor](https://github.com/FIBOSIO/bancor) .

#### 2).issue token 

```js
let ctx = fibos.contractSync("eosio.token");
ctx.exissueSync(to, quality, memo, {
				authorization: issuer
			})
```

>Only classic token can be issued !

#### 3).retire token 

```js
let ctx = fibos.contractSync("eosio.token");
ctx.exissueSync(from, quality, memo, {
				authorization: from
			})
```

#### 4).close token

```javascript
let ctx = fibos.contractSync("eosio.token");
ctx.excloseSync(owner, symbol, {
				authorization: owner
			});
```

#### 5).destory token

```JS
let ctx = fibos.contractSync("eosio.token");
let r = ctx.exdestroySync(symbol, {authorization: issuer});
```



### 10.To be continued... 

If you want get more api usage or use FIBOS node service，please go to  [fibos.io](https://fibos.io) !



## License

fibos.js is [MIT licensed](https://github.com/fibos/fibos.js/blob/master/LICENSE).
