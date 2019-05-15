const uuidV4 = require('uuid')
const { MapState, DidFail, DidPass, DidSkip } = require('./MapState')
const MapError = require('./MapError')
const AddContext = require('./AddContext')

module.exports = (data, suiteUUID, opts, sessionId) => {
    let test = {
        'title': data.title,
        'fullTitle': data.title,
        'timedOut': false,
        'duration': data._duration,
        'speed': 'fast',
        'pass': DidPass(data.state),
        'fail': DidFail(data.state),
        'pending': DidSkip(data.state),
        'code': '',
        'isRoot': false,
        'uuid': uuidV4(),
        'parentUUID': suiteUUID,
        'skipped': DidSkip(data.state),
        'isHook': false,
        'context': JSON.stringify(AddContext(data, opts, sessionId)),
        'state': MapState(data.state),
        'err': MapError(data.error)
    }

    return test
}
