export default (suiteResult, testResult) => {
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
