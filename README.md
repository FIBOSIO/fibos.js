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

## TodoList

- [ ] Complete use case
- [ ] Test with FIBOS

## License

fibos.js is [MIT licensed](https://github.com/fibos/fibos.js/blob/master/LICENSE).
