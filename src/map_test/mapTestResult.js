import uuidV4 from 'uuid'
import { mapState, didFail, didPass, didSkip } from './mapState'
import mapError from './mapError'
import buildContext from './buildContext'

export const MapTestResult = (data, suiteUUID, config, sessionId) => {
    let test = {
        'title': data.title,
        'fullTitle': data.title,
        'timedOut': false,
        'duration': data._duration,
        'speed': 'fast',
        'pass': didPass(data.state),
        'fail': didFail(data.state),
        'pending': didSkip(data.state),
        'code': '',
        'isRoot': false,
        'uuid': uuidV4(),
        'parentUUID': suiteUUID,
        'skipped': didSkip(data.state),
        'isHook': false,
        'context': buildContext(data, config.mochawesomeOpts, config.screenshotPath, sessionId),
        'state': mapState(data.state),
        'err': mapError(data.error)
    }

    return test
}
