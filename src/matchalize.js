const fs = require("fs");
const path = require("path");
const globby = require("globby");

class Matchalize {
	static get DEFAULT_OPTIONS() {
		return {
			texts: [],
			regex: [],
			files: [],
			sources: []
		};
	}
	static get formatDate() {
		return require(__dirname + "/formatDate.js");
	}

	static getIndexesOf(arr, val) {
		const indexes = [];
		var index = -1;
		while ((index = arr.indexOf(val, index + 1)) != -1) {
			indexes.push([index, val]);
		}
		return indexes;
	}

	static flatten(arr) {
		return arr.reduce((flat, toFlatten) => {
			return flat.concat(Array.isArray(toFlatten) ? this.flatten(toFlatten) : toFlatten);
		}, []);
	}

	static getExpressionsMerged(texts, regex, files) {
		var exprs = [];
		[].concat(texts || []).forEach((text) => exprs.push(text));
		[].concat(regex || []).forEach((regE) => exprs.push(new RegExp(regE, "g")));
		globby.sync([].concat(files || [])).forEach((file) => {
			const filepath = path.resolve(file);
			try {
				if (file.endsWith(".json")) {
					exprs = [].concat(exprs).concat(JSON.parse(fs.readFileSync(filepath).toString()));
				} else {
					exprs = [].concat(exprs).concat(require(filepath));
				}
			} catch (error) {
				console.log("[!] Error: could not find path: " + filepath);
				throw error;
			}
		});
		return this.flatten(exprs);
	}

	static assignMatchesForTextAndExpression(data, text, expression) {
		if (typeof expression === "string") {
			this.getIndexesOf(text, expression).forEach((match) => {
				data[match[0]] = [].concat(data[match[0]] || []).concat(match[1]);
			});
		} else if (expression instanceof RegExp) {
			var result = undefined;
			const id = "/" + expression.source + "/" + expression.flags;
			while ((result = expression.exec(text))) {
				data[result.index] = [].concat(data[result.index] || []).concat({
					pattern: id,
					text: result[0]
				});
			}
		} else {
			console.log(expression);
			throw new Error("MatchalizeUnrecognizedExpressionError", "Only strings or regexps");
		}
	}

	static getMatchesForSource(source, contents, expressions) {
		const data = {};
		expressions.forEach((expression) => this.assignMatchesForTextAndExpression(data, contents, expression));
		return data;
	}

	static getAllMatches(expressions, sources) {
		return sources.map((source) => {
			const contents = fs.readFileSync(source).toString();
			return {
				source,
				size: contents.length,
				matches: this.getMatchesForSource(source, contents, expressions)
			};
		});
	}

	static getAllAnalysis(matchesData) {
		const data = {};
		matchesData.forEach((match) => {
			const { source, matches } = match;
			Object.keys(matches).forEach((position) => {
				const matchSet = matches[position];
				matchSet.forEach((matchItem) => {
					var key = undefined;
					if (typeof matchItem === "string") {
						key = matchItem;
					} else if (typeof matchItem === "object") {
						key = matchItem.pattern;
					}
					if (!data[key]) {
						data[key] = {};
					}
					if (typeof matchItem === "string") {
						data[key].type = "string";
					} else if (typeof matchItem === "object") {
						data[key].type = "regexp";
					}
					if (!data[key].total) {
						data[key].total = 0;
					}
					data[key].total++;
					if (!data[key].files) {
						data[key].files = {};
					}
					if (!data[key].files[source]) {
						data[key].files[source] = 0;
					}
					data[key].files[source]++;
				});
			});
		});
		// return data;
		return Object.keys(data)
			.sort((a, b) => (data[a].total >= data[b].total ? -1 : 1))
			.map((id) => {
				return { name: id, ...data[id] };
			});
	}

	static formatMatchesToDump(files) {
		//return files;
		const data = {};
		files
			.sort((a, b) => (a.size >= b.size ? -1 : 1))
			.forEach((fileData) => {
				const filename = fileData.source;
				data[filename] = {
					size: fileData.size,
					matches: {}
				};
				Object.keys(fileData.matches).forEach((position) => {
					fileData.matches[position].forEach((match) => {
						data[filename].matches[position] = [];
						if (typeof match === "string") {
							data[filename].matches[position].push(match);
						} else {
							data[filename].matches[position].push(match.text);
						}
					});
					if (data[filename].matches[position].length === 1) {
						data[filename].matches[position] = data[filename].matches[position][0];
					}
				});
			});
		return data;
	}

	static dump(matchesData, analysisData, results, analysis) {
		if (results) {
			fs.writeFileSync(
				results.replace("{DATE}", this.formatDate(new Date())),
				JSON.stringify(this.formatMatchesToDump(matchesData), null, 2),
				"utf8"
			);
		}
		if (analysis) {
			fs.writeFileSync(
				analysis.replace("{DATE}", this.formatDate(new Date())),
				JSON.stringify(analysisData, null, 2),
				"utf8"
			);
		}
	}

	static run(options) {
		const { texts, regex, files, sources, results, analysis } = Object.assign({}, this.DEFAULT_OPTIONS, options);
		// 1. Put together input expressions;
		const allExpressions = this.getExpressionsMerged(texts, regex, files);
		// 2. Put together all the sources:
		const allSources = globby.sync(sources);
		// 3. Get all the matches info:
		const allMatches = this.getAllMatches(allExpressions, allSources);
		// 4. Get all the analysis info:
		const allAnalysis = this.getAllAnalysis(allMatches);
		// 5. Dump info:
		this.dump(allMatches, allAnalysis, results, analysis);
		// 6. Return info:
		return {
			expressions: allExpressions,
			sources: allSources,
			matches: allMatches,
			analysis: allAnalysis
		};
	}
}

module.exports = Matchalize;
