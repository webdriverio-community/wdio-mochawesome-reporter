WDIO Mochawesome Reporter
=========================

[![Build Check](https://github.com/jemishgopani/wdio-mochawesome-reporter/actions/workflows/build_check.yml/badge.svg?branch=wdio_v7_reporter_v5)](https://github.com/jemishgopani/wdio-mochawesome-reporter/actions/workflows/build_check.yml) [![npm version](https://badge.fury.io/js/wdio-mochawesome-reporter.svg)](https://badge.fury.io/js/wdio-mochawesome-reporter) [![npm](https://img.shields.io/npm/dm/wdio-mochawesome-reporter.svg?maxAge=2592000)]()

Generates test results in the json formated needed to create [Mochawesome](https://github.com/adamgruber/mochawesome) reports.


## WDIO Version Compatibility

There are breaking changes between WDIO v4 and v5 with how custom reporters work.  The chart below shows the versions of this reporter and their WDIO compatibility version.

| WDIO Json Reporter | WDIO |
| ------------------ | ---- |
| <= 2.0.1           | v4   |
| >= 3.0.0           | v5   |
| >= 4.0.0           | v6   |
| >= 5.0.0           | v7   |
| >= 6.0.0           | v8   |


# WDIO v7 Compatibility
## Installation

* NPM
```bash
npm install wdio-mochawesome-reporter --save-dev
```

* Yarn
```bash
yarn add wdio-mochawesome-reporter --dev
```

## Configuration

### Results to STDOUT
```js
reporters: [
  'dot',
  ['mochawesome',{ stdout: true }]
],
```

### Results to File
```js
reporters: [
  'dot',
  ['mochawesome',{
      outputDir: './Results'
  }]
],
```

### Results to File with custom file name
```js
reporters: [
  'dot',
  ['mochawesome',{
    outputDir: './Results',
    outputFileFormat: function(opts) {
        return `results-${opts.cid}.${opts.capabilities}.json`
    }
  }]
],
```

# WDIO v5 Compatibility

## Installation

* NPM
```bash
npm install wdio-mochawesome-reporter@^4.0.0 --save-dev
```

* Yarn
```bash
yarn add wdio-mochawesome-reporter@^4.0.0 --dev
```

## Configuration

### Results to STDOUT
```js
reporters: [
  'dot',
  ['mochawesome',{ stdout: true }]
],
```

### Results to File
```js
reporters: [
  'dot',
  ['mochawesome',{
      outputDir: './Results'
  }]
],
```

### Results to File with custom file name
```js
reporters: [
  'dot',
  ['mochawesome',{
    outputDir: './Results',
    outputFileFormat: function(opts) {
        return `results-${opts.cid}.${opts.capabilities}.json`
    }
  }]
],
```

## Result Files
With WDIO v5, reporting has moved from a centralized process to one that is handled by each of the "sessions" spun up for parallel test execution.
This change helped reduce the amount of chatter during WDIO test execution and thus improved performance.  The downside is we are no longer able
to get a single report for ALL test execution.  Consider the following:

2 suites of tests configured to run in 2 browsers:

* WDIO v4: 1 json file with execution results
* WDIO v5: 4 json files with execution results


`wdio-mochawesome-reporter` provides a utility function to merge the multiple json files into a single file.  You can Follow the steps below to take advantage of the utility.

### Command line

1) Create a small node script
```javascript
const mergeResults = require('wdio-mochawesome-reporter/mergeResults')
mergeResults()
```

2) Call node script from command line and pass 2 arguments

* <RESULTS_DIR>: Directory where results files are written
* <FILE_REGEX>: Regex pattern for finding `wdio-mochawesome-reporter` result files in <RESULTS_DIR>.  This is necessary because multiple reporters produce `json` result files

Example:
```bash
node mergeResults.js ./Results "wdio-mochawesome-*"
```

### As part of a wdio hook

The `onComplete` is a great place to call the `mergeResults` script. Usage this way requires passing in the results directory and the file pattern as arguments to the script.

```javascript
// Located in your wdio.conf.js file
onComplete: function (exitCode, config, capabilities, results) {
  const mergeResults = require('wdio-mochawesome-reporter/mergeResults')
  mergeResults('./Results', "results-*")
}
```

Upon completion, the merge script will output a single json file named `wdio-ma-merged.json` in the provided <RESULTS_DIR>

# WDIO v4 Compatibility


## Installation

* NPM
```bash
npm install wdio-mochawesome-reporter@^2.0.1 --save
```

* Yarn
```bash
yarn add wdio-mochawesome-reporter@^2.0.1 --dev
```

## Using

 Add ```mochawesome``` to the reporters array in your wdio config file.

```js
// sample wdio.conf.js
module.exports = {
  // ...
  reporters: ['dot', 'mochawesome'],
  // ...
};
```

## Reporter Configurations

The following configuration options are supported:

|option|default|description|
|---|---|---|
|includeScreenshots|false|All screenshots captured during test execution will be embedded in the report|
|screenshotUseRelativePath|false|By default sreenshots embeded in a report use an absolute path.  Set this option to true and have screenshot paths be relative to the mochawesome report folder.  This is useful if you want to publish the report to a static web server or zip it as a complete artifact of a build|


To use a configuration option add a ```mochawesomeOpts``` section to your wdio config.  Then add any options.
```js
// sample wdio.conf.js
module.exports = {
  // ...
  reporters: ['dot', 'mochawesome'],
  mochawesomeOpts: {
      includeScreenshots:true,
      screenshotUseRelativePath:true
  },
  // ...
};
```


# Mochawesome Report Generator
To convert the json generated by this package into a Mochawesome report you will need to use the [Mochawesome Report Generator](https://github.com/adamgruber/mochawesome-report-generator).

In summary...

* Add the package to your project
```shell
yarn add mochawesome-report-generator --dev
```

* Add a script to your package.json to generate the report
```json
  "scripts": {
    "generateMochawesome":"marge path/to/results.json --reportTitle 'My Project Results'"
  },
```
1) `path/to/results.json` = path and name of json file
2) `--reportTitle 'My Project Results'` = unique report title

## Version Compatibility
v1.x of ```wdio-mochawesome-reporter``` is compatible with ```2.3.2``` of ```mochawesome-report-generator```

v2.x of ```wdio-mochawesome-reporter``` is compatible with version ```3.1.5``` of ```mochawesome-report-generator```

v3.x of ```wdio-mochawesome-reporter``` is compatible with version ```3.1.5``` of ```mochawesome-report-generator```

v4.x of ```wdio-mochawesome-reporter``` is compatible with version ```3.1.5``` of ```mochawesome-report-generator```

v5.x of ```wdio-mochawesome-reporter``` is compatible with version ```6.2.0``` of ```mochawesome-report-generator```

v6.x of ```wdio-mochawesome-reporter``` is compatible with version ```6.2.0``` of ```mochawesome-report-generator```
