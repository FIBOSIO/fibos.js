var test = require("test");
test.setup();

run(`./ecc/`);
run(`./index.test.js`);
run(`./format.test.js`);
run(`./schema.test.js`);
run(`./structs.test.js`);

test.run(console.DEBUG);