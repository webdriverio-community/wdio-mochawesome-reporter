const events = require('events')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const stringify = require('json-stringify-safe')
const uuidV4 = require('uuid/v4')
const BuildTestResult = require('./TestResult')

/**
 * Initialize a new `Mochawesome` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

/* Note:
* Hierarchy of the WDIO reporting is: runner > spec > suite > test
*/
class WdioMochawesomeReporter extends events.EventEmitter {
    constructor (baseReporter, config, options = {}) {
        super()

        this.baseReporter = baseReporter
        this.config = config
        this.options = options

        const { epilogue } = this.baseReporter

        this.on('end', () => {
            // statistics about overall execution results
            const stats = {
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
            const results = {
                stats: stats,
                suites: [],
                allTests: [],
                allPending: [],
                allPasses: [],
                allFailures: [],
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
                                let testResult = BuildTestResult(suiteInfo.tests[testName], suiteResult.uuid, this.config,runnerInfo.sessionID)
                                suiteResult.tests.push(testResult)
                                results.allTests.push(testResult)
                                if (testResult.pass) {
                                    suiteResult.passes.push(testResult)
                                    results.allPasses.push(testResult)
                                } else if (testResult.fail) {
                                    suiteResult.failures.push(testResult)
                                    results.allFailures.push(testResult)
                                } else if (testResult.pending) {
                                    suiteResult.pending.push(testResult)
                                    results.allPending.push(testResult)
                                }
                            }
                            suiteResult.totalTests = suiteResult.tests.length
                            suiteResult.hasTests = suiteResult.tests.length > 0
                            suiteResult.totalPasses = suiteResult.passes.length
                            suiteResult.hasPasses = suiteResult.passes.length > 0
                            suiteResult.totalFailures = suiteResult.failures.length
                            suiteResult.hasFailures = suiteResult.failures.length > 0
                            suiteResult.totalPending = suiteResult.pending.length
                            suiteResult.hasPending = suiteResult.pending.length > 0

                            results.suites.suites.push(suiteResult)
                            results.stats.tests += suiteResult.totalTests
                            results.stats.testsRegistered += suiteResult.totalTests
                            results.stats.passes += suiteResult.totalPasses
                            results.stats.failures += suiteResult.totalFailures
                            results.stats.pending += suiteResult.totalPending
                        }
                    }

                    results.stats.suites = results.suites.suites.length
                    results.suites.hasSuites = results.suites.suites.length > 0
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
            'hasTests': false,
            'hasSuites': false,
            'totalTests': 0,
            'totalPasses': 0,
            'totalFailures': 0,
            'totalPending': 0,
            'totalSkipped': 0,
            'hasPasses': false,
            'hasFailures': false,
            'hasPending': false,
            'hasSkipped': false,
            'duration': 0,
            'rootEmpty': data.rootEmpty,
            '_timeout': 0,
            'uuid': uuidV4(),
            'hasBeforeHooks': false,
            'beforeHooks': [],
            'hasAfterHooks': false,
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

export default WdioMochawesomeReporter
