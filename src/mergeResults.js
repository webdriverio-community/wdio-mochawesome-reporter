const fs = require('fs')
const path = require('path')

const mergeResults = (...args) => {
    const dir = args[0] || process.argv[2]
    const filePattern = args[1] || process.argv[3]
    const customFileName = args[2] || process.argv[4]

    const rawData = getDataFromFiles(dir, filePattern)
    const mergedResults = mergeData(rawData)
    writeFile(dir, mergedResults, customFileName)
}

function getDataFromFiles (dir, filePattern) {
    const fileNames = fs.readdirSync(dir).filter(file => file.match(filePattern))
    const data = []

    fileNames.forEach(fileName => {
        data.push(JSON.parse(fs.readFileSync(`${dir}/${fileName}`)))
    })

    return data
}

function mergeData (rawData) {
    let mergedResults
    rawData.forEach(data => {
        if (mergedResults === undefined) {
            // use the first result so that we have the right shape for the mochawesome report generator
            mergedResults = {}
            Object.assign(mergedResults, data)
        } else {
            // increment stats totals
            mergedResults.stats.suites += data.stats.suites
            mergedResults.stats.tests += data.stats.tests
            mergedResults.stats.passes += data.stats.passes
            mergedResults.stats.pending += data.stats.pending
            mergedResults.stats.failures += data.stats.failures
            mergedResults.stats.duration += data.stats.duration
            mergedResults.stats.testsRegistered += data.stats.testsRegistered
            mergedResults.stats.skipped += data.stats.skipped
            mergedResults.stats.hasSkipped = mergedResults.stats.skipped > 0
            mergedResults.stats.passPercent = mergedResults.stats.tests === 0 ? 0 : Math.round((mergedResults.stats.passes / mergedResults.stats.tests) * 100)
            mergedResults.stats.pendingPercent = mergedResults.stats.tests === 0 ? 0 : Math.round((mergedResults.stats.pending / mergedResults.stats.tests) * 100)

            // add suites
            data.results[0].suites.forEach(suite => {
                mergedResults.results[0].suites.push(suite)
            })
        }
    })
    return mergedResults
}

function writeFile (dir, mergedResults, customFileName) {
    const fileName = customFileName || 'wdio-ma-merged.json'
    const filePath = path.join(dir, fileName)
    fs.writeFileSync(filePath, JSON.stringify(mergedResults))
}

module.exports = mergeResults
