export const mapState = (state) => {
    switch (state.toLowerCase()) {
    case 'pass':
        return 'passed'
    case 'fail':
        return 'failed'
    default:
        break
    }
}

export const didPass = (state) => {
    return state.toLowerCase() === 'pass'
}

export const didFail = (state) => {
    return state.toLowerCase() === 'fail'
}

export const didSkip = (state) => {
    return state.toLowerCase() === 'pending'
}
