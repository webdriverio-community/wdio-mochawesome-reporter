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
    return state.toLowerCase() === 'pass'
}

export const DidFail = (state) => {
    return state.toLowerCase() === 'fail'
}

export const DidSkip = (state) => {
    return state.toLowerCase() === 'pending'
}
