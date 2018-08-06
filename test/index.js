const fs = require('fs');
const path = require('path');
const test = require("test");
test.setup();

let oneCase;
if (argv.length > 2) {
    oneCase = argv[2];
}

["", "ecc"].forEach(type => {
  fs.readdir(path.join(__dirname, `./${type}`))
      .filter(f => f.slice(-8) === ".test.js")
      .forEach(f => {
          if (!oneCase || f.startsWith(oneCase)) {
              run(`./${type}/${f}`);
          }
      });
});

test.run(console.DEBUG);