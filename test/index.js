var test = require('test');
test.setup();

run('./eosjs-api.test');
run('./eosjs-jssig.test');
run('./eosjs-serialize.test');

test.run(console.DEBUG);
