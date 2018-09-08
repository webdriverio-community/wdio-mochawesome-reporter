export const MapState = (state) => {
    switch (state.toLowerCase()) {
    case 'pass':
        return 'passed'
    case 'fail':
        return 'failed'
    default:
        break
    }
}

export const DidPass = (state) => {
    return state.toLowerCase() === 'pass' || state.toLowerCase() === 'passed'
}

export const DidFail = (state) => {
    return state.toLowerCase() === 'fail' || state.toLowerCase() === 'failed'
}

export const DidSkip = (state) => {
    return state.toLowerCase() === 'pending' || state.toLowerCase() === 'skipped'
}
