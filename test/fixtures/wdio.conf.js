var mochawesomeReporter = require('../../build/reporter')
mochawesomeReporter.reporterName = 'mochawesome'

exports.config = {
    baseUrl: 'https://travis-ci.org/fijijavis/wdio-mochawesome-reporter',
    host: 'localhost',
    port: 4444,
    coloredLogs: true,
    logLevel: 'verbose',
    reporters: [mochawesomeReporter],
    framework: 'mocha',
    mochaOpts: {
        ui: 'tdd',
        timeout: 20000
    },
    screenshotOnReject: false,
    reporterOptions: {
        outputDir: './wdio-mochawesome-report',
    },
    capabilities: [{
        browserName: 'phantomjs'
    }],
    afterTest: function (test) {
        var fs = require('fs')

        if (!fs.existsSync(this.reporterOptions.outputDir)) {
            fs.mkdirSync(this.reporterOptions.outputDir)
        }
        
    }
}
