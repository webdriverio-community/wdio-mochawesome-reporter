module.exports = (runner) => {
    let stats = {
        'suites': 0,
        'tests': 0,
        'passes': 0,
        'pending': 0,
        'failures': 0,
        'start': runner.start,
        'end': runner.end,
        'duration': runner._duration,
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
