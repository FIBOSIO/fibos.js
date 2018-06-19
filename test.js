var Eos = require('./')

// Default configuration (additional options below)
config = {
	chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca', // 32 byte (64 char) hex string
	keyProvider: ['PrivateKeys...'], // WIF string or array of keys..
	httpEndpoint: 'http://115.47.152.177:8888',
	expireInSeconds: 60,
	broadcast: true,
	verbose: false, // API activity
	sign: true
}

var eos = Eos(config);
eos.getInfo((error, result) => {
	console.log("getInfo:", error, result);
})

var v = eos.getInfoSync()
console.log("getInfoSync:", v);

eos.getBlock(1, (error, result) => {
	console.log("getBlock:", error, result);
})

var v = eos.getBlockSync(1)
console.log("getBlockSync:", v);