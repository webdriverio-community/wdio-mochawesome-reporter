const MapState = (state) => {
    switch (state.toLowerCase()) {
    case 'pass':
        return 'passed'
    case 'fail':
        return 'failed'
    default:
        break
    }
}

const DidPass = (state) => {
    return state.toLowerCase() === 'pass' || state.toLowerCase() === 'passed'
}

const DidFail = (state) => {
    return state.toLowerCase() === 'fail' || state.toLowerCase() === 'failed'
}

const DidSkip = (state) => {
    return state.toLowerCase() === 'pending' || state.toLowerCase() === 'skipped'
}

module.exports = { MapState, DidPass, DidFail, DidSkip }
