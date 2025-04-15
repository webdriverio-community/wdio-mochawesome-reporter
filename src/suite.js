const { v4: uuid } = require('uuid')
module.exports = class {
    constructor (isRoot, data, saniCaps) {
        this.title = ''
        this.suites = []
        this.tests = []
        this.root = isRoot
        this._timeout = 5000
        this.file = ''
        this.uuid = uuid()
        this.fullFile = ''
        this.beforeHooks = []
        this.afterHooks = []
        this.passes = []
        this.failures = []
        this.pending = []
        this.skipped = []
        this.duration = 0

        if (!isRoot) {
            this.title = data.title

            if (saniCaps) {
                this.title = `${this.title} (${saniCaps})`
            }

            if (data.file) {
                this.file = data.file
                this.fullFile = data.fullFile || data.file
            }
        }
    }

    addSuite (suite) {
        this.suites.push(suite)
    }

    addTest (test) {
        this.tests.push(test)
        if (test.pass) {
            this.passes.push(test.uuid)
        } else if (test.fail) {
            this.failures.push(test.uuid)
        } else if (test.pending) {
            this.pending.push(test.uuid)
            this.skipped.push(test.uuid)
        }
    }

    addBeforeHook (hook) {
        this.beforeHooks.push(hook)
    }

    addAfterHook (hook) {
        this.afterHooks.push(hook)
    }
}
