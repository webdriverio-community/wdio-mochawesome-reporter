export default function (error) {
    let err = {}
    if (error) {
        err.name = error.type
        err.message = error.message
        err.estack = error.stack
        err.stack = error.stack
        if (error.actual && error.expected) {
            err.showDiff = true
            err.actual = error.actual
            err.expected = error.expected
        }
    }
    return err
}
