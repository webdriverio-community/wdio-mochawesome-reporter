export default (baseReporter) => {
    let stats = {
        'suites': 0,
        'tests': 0,
        'passes': 0,
        'pending': 0,
        'failures': 0,
        'start': baseReporter.stats.start,
        'end': baseReporter.stats.end,
        'duration': baseReporter.stats._duration,
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

    return stats
}
