import { MapTestResult } from './map_test'
import { AddTestResult, MapSuiteResult } from './map_suite'
import events from 'events'
import writeResults from './writeResults'
import { InitStats, UpdateStats } from './map_stats'
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
            // structure for mochawesome json reporter
            const results = {
                stats: InitStats(this.baseReporter),
                suites: [],
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
                                results.stats = UpdateStats(results.stats, testResult)
                            }

                            results.suites.suites.push(suiteResult)
                            results.stats.suites += 1
                        }
                    }
                }
            }

            writeResults(results, this.options)
            epilogue.call(baseReporter)
        })
    }
}

export default WdioMochawesomeReporter
