const stripAnsi = require('strip-ansi')

/**
 * Jest Matchers returns error strings with ansi color information
 * https://github.com/jest-community/vscode-jest/issues/279
 * 
 * stripAnsi will remove those colors.  
 * Tested with Jest Matchers AND Chai (which does not include the ansi characters)
 */
module.exports = function (error) {
    let err = {}
    if (error) {
        err.name = error.type
        err.message = stripAnsi(error.message)
        err.estack = stripAnsi(error.stack)
        err.stack = stripAnsi(error.stack)
        if (error.actual && error.expected) {
            err.showDiff = true
            err.actual = error.actual
            err.expected = error.expected
        }
    }
    return err
}
