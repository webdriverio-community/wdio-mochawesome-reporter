const events = require('events')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const uuidV4 = require('uuid/v4')

/**
 * Initialize a new `Mochawesome` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

/* Note:
* Hierarchy of the WDIO reporting is: runner > spec > suite > test
*/
class WdioMochawesomeReporterV3 extends events.EventEmitter {
    constructor (baseReporter, config, options = {}) {
        super()

        this.baseReporter = baseReporter
        this.config = config
        this.options = options

        const { epilogue } = this.baseReporter

        this.on('end', () => {
            // statistics about overall execution results
            let stats = {
                'suites': 0,
                'tests': 0,
                'passes': 0,
                'pending': 0,
                'failures': 0,
                'start': this.baseReporter.stats.start,
                'end': this.baseReporter.stats.end,
                'duration': this.baseReporter.stats._duration,
                'testsRegistered': 0,
                'passPercent': 0,
                'pendingPercent': 0,
                'other': 0,
                'hasOther': false,
                'skipped': 0,
                'hasSkipped': false,
                'passPercentClass': 'success',
                'pendingPercentClass': 'danger'
            }

            // structure for mochawesome json reporter
            let results = {
                stats: stats,
                suites: {},
                copyrightYear: new Date().getFullYear()
            }

            // build the mochawesome root suite.
            let rootSuite = this.buildSuite(true, {'title': ''})
            results.suites = rootSuite

            // runner loop
            for (let cid of Object.keys(this.baseReporter.stats.runners)) {
                let runnerInfo = this.baseReporter.stats.runners[cid]
                let sanitizedCapabilities = runnerInfo.sanitizedCapabilities
                // specs loop
                for (let specId of Object.keys(runnerInfo.specs)) {
                    let specInfo = runnerInfo.specs[specId]
                    // suites loop
                    for (let suiteName of Object.keys(specInfo.suites)) {
                        var suiteInfo = specInfo.suites[suiteName]

                        // exclude before all and after all 'suites'
                        if (!suiteInfo.uid.includes('before all') && !suiteInfo.uid.includes('after all') && Object.keys(suiteInfo.tests).length > 0) {
                            suiteInfo.sanitizedCapabilities = sanitizedCapabilities
                            let suiteResult = this.buildSuite(false, suiteInfo)

                            // tests loop
                            for (let testName of Object.keys(suiteInfo.tests)) {
                                if (suiteInfo.tests[testName].uid !== 'undefined') {
                                    let testResult = this.buildTest(suiteInfo.tests[testName], suiteResult.uuid, runnerInfo.capabilities)

                                    suiteResult.tests.push(testResult)
                                    results.stats.tests++
                                    results.stats.testsRegistered++
                                    if (testResult.pass) {
                                        suiteResult.passes.push(testResult.uuid)
                                        results.stats.passes++
                                    } else if (testResult.fail) {
                                        suiteResult.failures.push(testResult.uuid)
                                        results.stats.failures++
                                    } else if (testResult.pending) {
                                        suiteResult.pending.push(testResult.uuid)
                                        results.stats.pending++
                                    }
                                }
                            }

                            results.suites.suites.push(suiteResult)
                            results.stats.suites++
                        }
                    }
                }
            }

            // calculate percentages for overall summary
            results.stats.passPercent = results.stats.tests === 0 ? 0 : Math.round((results.stats.passes / results.stats.tests) * 100)
            results.stats.pendingPercent = results.stats.tests === 0 ? 0 : Math.round((results.stats.pending / results.stats.tests) * 100)

            this.write(results)

            epilogue.call(baseReporter)
        })
    }

    // creates a new suite object to be added to the results
    buildSuite (isRoot, data) {

        let suite = {
            'title': '',
            'suites': [],
            'tests': [],
            'pending': [],
            'root': isRoot,
            'fullFile': '',
            'file': '',
            'passes': [],
            'failures': [],
            'skipped': [],
            'duration': 0,
            'rootEmpty': isRoot,
            '_timeout': 0,
            'uuid': uuidV4(),
            'beforeHooks': [],
            'afterHooks': []
        }

        if (!isRoot) {
            suite.title = data.title

            if (data.sanitizedCapabilities) {
                suite.title = `${suite.title} (${data.sanitizedCapabilities})`
            }

            if (data._duration) {
                suite.duration = data._duration
            }
        }

        return suite
    }

    // creates a new test object to be added to a suite
    buildTest (data, suiteUUID, caps) {
      
        let test = {
            'title': data.title,
            'fullTitle': data.title,
            'timedOut': false,
            'duration': data._duration,
            'speed': 'fast',
            'pass': false,
            'fail': false,
            'pending': false,
            'code': '',
            'err': {},
            'isRoot': false,
            'uuid': uuidV4(),
            'parentUUID': suiteUUID,
            'skipped': false,
            'isHook': false
        }

        if (data.state === 'pending') {
            test.pending = true
        } else if (data.state === 'pass') {
            test.pass = true
            test.state = 'passed'
        } else if (data.state === 'fail') {
            test.fail = true
            test.state = 'failed'
        }

        if (data.error) {
            test.err.name = data.error.type
            test.err.message = data.error.message
            test.err.estack = data.error.stack
            test.err.stack = data.error.stack
            if (data.error.actual && data.error.expected) {
                test.err.showDiff = true
                test.err.actual = data.error.actual
                test.err.expected = data.error.expected
            }
        }

        if (this.config.mochawesomeOpts && this.config.mochawesomeOpts.includeScreenshots) {
            /**
             * output is a log of all the wdio commands issued for a test
             * we can filter this for any screenshot commands and include them in the context array
             */
            let screenshotCommands = data.output.filter(function (cmd) {
                return cmd.type === 'screenshot'
            })
            // don't add a context key if there isn't anything to add
            if (screenshotCommands.length > 0) {
                let context = []

                // https://github.com/adamgruber/mochawesome#example
                // hardcoded path of screenshots is relative to the mochawesome output dir
                screenshotCommands.forEach(cmd => {
                    context.push({title: `Screenshot: ${cmd.payload.filename}`, value: path.join('screenshots', cmd.payload.filename)})
                })

                test.context = JSON.stringify(context)
            }
        }

        return test
    }

    // outputs json and html reports
    write (json) {
        if (!this.options || typeof this.options.outputDir !== 'string') {
            return console.log(`Cannot write json report: empty or invalid 'outputDir'.`)
        }

        try {
            const dir = path.resolve(this.options.outputDir)
            const filename = this.options.mochawesome_filename ? this.options.mochawesome_filename : 'wdiomochawesome.json'
            const filepath = path.join(dir, filename)
            mkdirp.sync(dir)
            fs.writeFileSync(filepath, JSON.stringify(json))
            console.log(`Wrote json report to [${this.options.outputDir}].`)
        } catch (e) {
            console.log(`Failed to write json report to [${this.options.outputDir}]. Error: ${e}`)
        }
    }
}

export default WdioMochawesomeReporterV3
