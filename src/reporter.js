import { MapTestResult } from './map_test/mapTestResult'
import { MapSuiteResult, UpdateSuiteTotals, AddTestResult } from './map_suite/mapSuiteResult'
import events from 'events'
import writeResults from './writeResults'
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
                            let suiteResult = MapSuiteResult(false, suiteInfo, sanitizedCapabilities)

                            // tests loop
                            for (let testName of Object.keys(suiteInfo.tests)) {
                                let testResult = MapTestResult(suiteInfo.tests[testName], suiteResult.uuid, this.config, runnerInfo.sessionID)
                                suiteResult = AddTestResult(suiteResult, testResult)

                                results.allTests.push(testResult)
                                if (testResult.pass) {
                                    results.allPasses.push(testResult)
                                } else if (testResult.fail) {
                                    results.allFailures.push(testResult)
                                } else if (testResult.pending) {
                                    results.allPending.push(testResult)
                                }
                            }

                            suiteResult = UpdateSuiteTotals(suiteResult)

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

            writeResults(results, this.options)

            epilogue.call(baseReporter)
        })
    }
}

export default WdioMochawesomeReporter
