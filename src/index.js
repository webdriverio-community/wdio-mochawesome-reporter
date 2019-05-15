const WDIOReporter = require('@wdio/reporter').default
const { InitStats, UpdateStats } = require('./map_stats')
const { MapSuiteResult, AddTestResult } = require('./map_suite')
const { MapTestResult } = require('./map_test')

class WdioMochawesomeReporter extends WDIOReporter {
    constructor (options) {
        options = Object.assign(options)
        super(options)
    }

    onRunnerEnd (runner) {
        let json = this.prepareJson(runner)
        this.write(JSON.stringify(json))
    }

    prepareJson (runner) {
        let results = {
            stats: InitStats(runner),
            suites: [],
            copyrightYear: new Date().getFullYear()
        }

        // mochawesome requires this root suite for HTML report generation to work properly
        results.suites = MapSuiteResult(true, {'title': ''})
        for (let suiteKey of Object.keys(this.suites)) {
            const suiteInfo = this.suites[suiteKey]
            if (!suiteInfo.uid.includes('before all') && !suiteInfo.uid.includes('after all') && Object.keys(suiteInfo.tests).length > 0) {
                let suiteResult = MapSuiteResult(false, suiteInfo, runner.sanitizedCapabilities)

                // tests loop
                for (let testName of Object.keys(suiteInfo.tests)) {
                    let testResult = MapTestResult(suiteInfo.tests[testName], suiteResult.uuid, runner.config, runner.sessionId)
                    suiteResult = AddTestResult(suiteResult, testResult)
                    results.stats = UpdateStats(results.stats, testResult)
                }

                results.suites.suites.push(suiteResult)
                results.stats.suites += 1
            }
        }

        return results
    }
}

exports.default = WdioMochawesomeReporter
