export default (currStats, results) => {
    let stats = currStats

    stats.tests += 1
    stats.testsRegistered += 1
    if (results.pass) {
        stats.passes += 1
    } else if (results.fail) {
        stats.failures += 1
    } else if (results.pending) {
        stats.pending += 1
    }

    stats.passPercent = stats.tests === 0 ? 0 : Math.round((stats.passes / stats.tests) * 100)
    stats.pendingPercent = stats.tests === 0 ? 0 : Math.round((stats.pending / stats.tests) * 100)

    return stats
}
