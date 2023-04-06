module.exports = class {
    constructor (start) {
        this.suites = 0
        this.tests = 0
        this.passes = 0
        this.pending = 0
        this.failures = 0
        this.start = start
        this.end = ''
        this.duration = 0
        this.testsRegistered = 0
        this.passPercent = 0
        this.pendingPercent = 0
        this.other = 0
        this.hasOther = false
        this.skipped = 0
        this.hasSkipped = false
    }

    incrementSuites () {
        this.suites += 1
    }

    incrementTests (result) {
        this.tests += 1
        this.testsRegistered += 1
        if (result.pass) {
            this.passes += 1
        } else if (result.fail) {
            this.failures += 1
        } else if (result.pending) {
            this.pending += 1
            this.skipped += 1
            this.hasSkipped = true
        }

        this.passPercent = this.tests === 0 ? 0 : Math.round((this.passes / this.tests) * 100)
        this.pendingPercent = this.tests === 0 ? 0 : Math.round((this.pending / this.tests) * 100)
    }
}
