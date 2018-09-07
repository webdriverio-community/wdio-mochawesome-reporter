import uuidV4 from 'uuid'
import { MapState, DidFail, DidPass, DidSkip } from './MapState'
import MapError from './MapError'
import AddContext from './AddContext'

export default (data, suiteUUID, config, sessionId) => {
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
        'context': JSON.stringify(AddContext(data, config.mochawesomeOpts, config.screenshotPath, sessionId)),
        'state': MapState(data.state),
        'err': MapError(data.error)
    }

    return test
}
