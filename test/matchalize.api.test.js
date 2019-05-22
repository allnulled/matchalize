const fs = require("fs");
const rimraf = require("rimraf");
const Matchalize = require(__dirname + "/../src/matchalize.js");
const { expect } = require("chai");

describe("Matchalize class", function() {

	before(function() {
		rimraf.sync(__dirname + "/files/api.*.json");
	});

	after(function() {
		// rimraf.sync(__dirname + "/files/api.*.json");
	});
	
	it("Matchalize.analyze(...) with results as output", function() {
		expect(fs.existsSync(__dirname + "/files/api.matches.json")).to.equal(false);
		const results = Matchalize.run({
			texts: "en",
			regex: "ent[r]e",
			sources: __dirname + "/files/**/*.txt",
			results: __dirname + "/files/api.matches.json",
			analysis: __dirname + "/files/api.analysis.json",
		});
		expect(fs.existsSync(__dirname + "/files/api.matches.json")).to.equal(true);
		expect(typeof JSON.parse(fs.readFileSync(__dirname + "/files/api.matches.json").toString())).to.equal("object");
	});

	it("Matchalize.analyze(...) without analysis as output", function() {
		const results = Matchalize.run({
			texts: "hacia",
			regex: "ha(sta)",
			files: [__dirname + "/matchers.js", __dirname + "/matchers.json"],
			sources: __dirname + "/files/**/*.txt",
			results: __dirname + "/files/api.2.matches.{DATE}.json",
			analysis: __dirname + "/files/api.2.analysis.{DATE}.json",
		});
		expect(typeof results).to.equal("object");
		expect(typeof results.expressions).to.equal("object");
		expect(typeof results.sources).to.equal("object");
		expect(typeof results.matches).to.equal("object");
		expect(typeof results.analysis).to.equal("object");
	});

});