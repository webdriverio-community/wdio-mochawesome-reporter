import uuidV4 from 'uuid/v4'

export const MapSuiteResult = (isRoot, data, saniCaps) => {
    let suite = {
        'title': '',
        'suites': [],
        'tests': [],
        'pending': [],
        'root': isRoot,
        'fullFile': '',
        'file': '',
        'passes': [],
        'failures': [],
        'skipped': [],
        'hasTests': false,
        'hasSuites': false,
        'totalTests': 0,
        'totalPasses': 0,
        'totalFailures': 0,
        'totalPending': 0,
        'totalSkipped': 0,
        'hasPasses': false,
        'hasFailures': false,
        'hasPending': false,
        'hasSkipped': false,
        'duration': 0,
        'rootEmpty': data.rootEmpty,
        '_timeout': 0,
        'uuid': uuidV4(),
        'hasBeforeHooks': false,
        'beforeHooks': [],
        'hasAfterHooks': false,
        'afterHooks': []
    }

    if (!isRoot) {
        suite.title = data.title

        if (saniCaps) {
            suite.title = `${suite.title} (${saniCaps})`
        }

        if (data._duration) {
            suite.duration = data._duration
        }
    }

    return suite
}

export const UpdateSuiteTotals = (suiteResult) => {
    let result = suiteResult

    result.totalTests = suiteResult.tests.length
    result.hasTests = suiteResult.tests.length > 0
    result.totalPasses = suiteResult.passes.length
    result.hasPasses = suiteResult.passes.length > 0
    result.totalFailures = suiteResult.failures.length
    result.hasFailures = suiteResult.failures.length > 0
    result.totalPending = suiteResult.pending.length
    result.hasPending = suiteResult.pending.length > 0

    return result
}

export const AddTestResult = (suiteResult, testResult) => {
    let result = suiteResult

    result.tests.push(testResult)
    if (testResult.pass) {
        result.passes.push(testResult)
    } else if (testResult.fail) {
        result.failures.push(testResult)
    } else if (testResult.pending) {
        result.pending.push(testResult)
    }

    return result
}
