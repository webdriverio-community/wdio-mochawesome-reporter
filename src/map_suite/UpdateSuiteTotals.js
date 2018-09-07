export default (suiteResult) => {
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
