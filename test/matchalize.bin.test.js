const fs = require("fs");
const path = require("path");
const exec = require("execute-command-sync");
const rimraf = require("rimraf");
const { expect } = require("chai");

describe("Matchalize binary", function() {

	before(function() {
		rimraf.sync(__dirname + "/files/bin.*.json");
	});

	after(function() {
		// rimraf.sync(__dirname + "/files/bin.*.json");
	});

	it("matchalize CLI tool", function() {
		expect(fs.existsSync(__dirname + "/files/bin.matches.json")).to.equal(false);
		exec(`./bin/matchalize --texts bajo cabe --regex "en(tre)?" --files matchers.js matchers.json --sources "${__dirname}/files/**/*.txt" --results test/files/bin.matches.json --analysis test/files/bin.analysis.json`, {cwd: path.resolve(__dirname + "/..")});
		expect(fs.existsSync(__dirname + "/files/bin.matches.json")).to.equal(true);
		expect(typeof JSON.parse(fs.readFileSync(__dirname + "/files/bin.matches.json").toString())).to.equal("object");
	});
});