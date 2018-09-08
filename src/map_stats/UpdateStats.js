export default (currStats, suiteResult) => {
    let stats = currStats

    stats.tests += suiteResult.totalTests
    stats.testsRegistered += suiteResult.totalTests
    stats.passes += suiteResult.totalPasses
    stats.failures += suiteResult.totalFailures
    stats.pending += suiteResult.totalPending
    stats.suites++
    stats.hasSuites = true
    stats.passPercent = stats.tests === 0 ? 0 : Math.round((stats.passes / stats.tests) * 100)
    stats.pendingPercent = stats.tests === 0 ? 0 : Math.round((stats.pending / stats.tests) * 100)

    return stats
}
