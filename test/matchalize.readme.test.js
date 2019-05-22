const path = require("path");
const rimraf = require("rimraf");
const exec = require("execute-command-sync");
const { expect } = require("chai");

describe("Matchalize README examples", function() {
	before(function() {
		rimraf.sync(__dirname + "/somepath");
	});

	it("works as expected", function() {
		const opt = { cwd: __dirname };
		exec(`mkdir somepath`, opt);
		exec(`echo "module.exports = ['File', /[0-9]/g]" > somepath/input.js`, opt);
		exec(`echo '["File 1", "File 2", "File 3"]' > somepath/input.json`, opt);
		exec(`echo "File 1..." > somepath/sample-1.txt`, opt);
		exec(`echo "File 2..." > somepath/sample-2.txt`, opt);
		exec(`echo "File 3..." > somepath/sample-3.txt`, opt);
		exec(`./bin/matchalize `
		  + `--texts     "." "n" `
		  + `--regex     "File [0-9]+" `
		  + `--files     ./test/somepath/*.js ./test/somepath/*.json `
		  + `--sources   ./test/somepath/*.txt `
		  + `--results   ./test/somepath/result.json `
		  + `--analysis  ./test/somepath/analysis.json`, {cwd: path.resolve(__dirname + "/..")});
	});
});
