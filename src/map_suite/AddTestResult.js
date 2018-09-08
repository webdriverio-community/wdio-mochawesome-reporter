export default (suiteResult, testResult) => {
    let result = suiteResult
    result.tests.push(testResult)

    if (testResult.pass) {
        result.passes.push(testResult.uuid)
    } else if (testResult.fail) {
        result.failures.push(testResult.uuid)
    } else if (testResult.pending) {
        result.pending.push(testResult.uuid)
    }
    return result
}
