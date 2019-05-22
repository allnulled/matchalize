# matchalize

Find strings and regular expressions on files and get matches per file and files per match.

It works from CLI or API.

## Installation

`$ npm i matchalize -g`

### CLI example

1. Given a structure of files like:

```
$ mkdir somepath
$ echo "module.exports = ['File', /[0-9]/g]" > somepath/input.js
$ echo '["File 1", "File 2", "File 3"]' > somepath/input.json
$ echo "File 1..." > somepath/sample-1.txt
$ echo "File 2..." > somepath/sample-2.txt
$ echo "File 3..." > somepath/sample-3.txt
```

2. And given a command execution like:

```
$ matchalize
   --texts     "." "n"
   --regex     "File [0-9]+"
   --files     somepath/*.js somepath/*.json
   --sources   somepath/*.txt
   --results   somepath/result.json
   --analysis  somepath/analysis.json
```

Or, alternatively, an API call like:

```
require("matchalize").run({
  texts:     [".", "n"],
  regex:     "File [0-9]+",
  files:     ["somepath/*.js", "somepath/*.json"],
  sources:   "somepath/*.txt",
  results:   "somepath/result.json",
  analysis:  "somepath/analysis.json"
});
```

4. Expect an output like:

```
// files/result.json:
{
  "./test/somepath/sample-1.txt": {
    "size": 10,
    "matches": {
      "0": "File 1",
      "5": "1",
      "6": ".",
      "7": ".",
      "8": "."
    }
  },
  "./test/somepath/sample-2.txt": {
    "size": 10,
    "matches": {
      "0": "File 2",
      "5": "2",
      "6": ".",
      "7": ".",
      "8": "."
    }
  },
  "./test/somepath/sample-3.txt": {
    "size": 10,
    "matches": {
      "0": "File 3",
      "5": "3",
      "6": ".",
      "7": ".",
      "8": "."
    }
  }
}
```

```
// files/analysis.json:
[
  {
    "name": ".",
    "total": 9,
    "files": {
      "./test/somepath/sample-1.txt": 3,
      "./test/somepath/sample-2.txt": 3,
      "./test/somepath/sample-3.txt": 3
    }
  },
  {
    "name": "/File [0-9]+/g",
    "total": 3,
    "files": {
      "./test/somepath/sample-1.txt": 1,
      "./test/somepath/sample-2.txt": 1,
      "./test/somepath/sample-3.txt": 1
    }
  },
  {
    "name": "File",
    "total": 3,
    "files": {
      "./test/somepath/sample-1.txt": 1,
      "./test/somepath/sample-2.txt": 1,
      "./test/somepath/sample-3.txt": 1
    }
  },
  {
    "name": "/[0-9]/g",
    "total": 3,
    "files": {
      "./test/somepath/sample-1.txt": 1,
      "./test/somepath/sample-2.txt": 1,
      "./test/somepath/sample-3.txt": 1
    }
  },
  {
    "name": "File 1",
    "total": 1,
    "files": {
      "./test/somepath/sample-1.txt": 1
    }
  },
  {
    "name": "File 2",
    "total": 1,
    "files": {
      "./test/somepath/sample-2.txt": 1
    }
  },
  {
    "name": "File 3",
    "total": 1,
    "files": {
      "./test/somepath/sample-3.txt": 1
    }
  }
]
```

To see this same example go to `/test/matchalize.readme.test.js`.

## Usage

The CLI and the API work almost the same.

The CLI passes its options through `--option value1 value2 value3`.

The API passes its options through `{option: [value1, value2, value3]}`.

Also, the API returns the information in an object, beside dumping results (if specified).

By default, the CLI dumps the results at `results.{DATE}.json` and `analysis.{DATE}.json`.

To see the options from the CLI, just type:

`$ matchalize`

#### Options

The options below are the parameters of the CLI.

Note that only `--sources` is **required**:

- `--texts`: (*optional*, *array*) strings that are searched for in the sources, passed directly as plain text.

- `--regex`: (*optional*, *array*) regular expressions that are searched for in the sources, passed directly as plain text. They will be the text of the javascript `RegExp`.

- `--files`: (*optional*, *array*) javascript or `.json` files passed as strings or regular expressions. The `.json` files can only contain strings. The other type of files will be understood as `.js` files, and what they export is what they pass to the tool, so they can contain both, strings or regular expressions. This parameter accepts `glob` patterns.

- `--sources`: (**REQUIRED**, *string*) files that will be used to search for the strings and regular expressions provided by the previous options. This parameter accepts `glob` patterns.

- `--results`: (*optional*, *string*) file into which the tool will dump the results file. 

This file shows the positions of each match per file.

This file has this shape:

```
{
  "<file>": {
    size: <size of the file>,
    matches: {
      "<position>": "<unique match>" OR ["<match 1>", <match 2>", ...],
      "<position>": "<unique match>" OR ["<match 1>", <match 2>", ...],
      ...
    }
  },
  ...
}
```

This file sorts the files by their size.

- `--analysis`: (*optional*, *string*) the file into which the tool will dump the analyisis file.  

This file has this shape:

```
[
  {
    "name": "<string or pattern>",
    "total": <total occurrences>,
    "files": {
      "<file>": <total occurrences in file>,
      "<file>": <total occurrences in file>,
      ...
    }
  },
  ...
]
```# Read this file
# Read this file
# Read this file
