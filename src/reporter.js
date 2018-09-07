import { MapTestResult } from './map_test/mapTestResult'
import { MapSuiteResult } from './map_suite/mapSuiteResult'
import events from 'events'
import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'

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
            let rootSuite = MapSuiteResult(true, {'title': ''})
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
                            let suiteResult = MapSuiteResult(false, suiteInfo)

                            // tests loop
                            for (let testName of Object.keys(suiteInfo.tests)) {
                                let testResult = MapTestResult(suiteInfo.tests[testName], suiteResult.uuid, this.config, runnerInfo.sessionID)
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
