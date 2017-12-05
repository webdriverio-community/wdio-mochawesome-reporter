import fs from 'fs'
import path from 'path'
import del from 'del'
import Launcher from 'webdriverio/build/lib/launcher'

const resultsDir = path.join(__dirname, '../wdio-mochawesome-report')

export function getResults () {
    return getResultFiles('json').map((file) => {
        return JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf-8'))
    })
}

export function getResultFiles (patterns) {
    if (!Array.isArray(patterns)) {
        patterns = [patterns]
    }
    return fs.readdirSync(resultsDir).filter((file) =>
        patterns.some(pattern => file.endsWith('.' + pattern)))
}

export function clean () {
    return del(resultsDir)
}

export function run (specs, conf='wdio') {
    console.log('Using Config',conf)
    disableOutput()
    
    const launcher = new Launcher(`./test/fixtures/${conf}.conf.js`, {
        specs: specs.map(spec => `./test/fixtures/specs/${spec}.js`)
    })

    return launcher.run().then(() => {
        enableOutput()
        return getResults()
    })
}

let logs, originalConsole

function disableOutput () {
    if (process.env.FULL_OUTPUT) {
        return
    }
    const mockLog = (type) => (...message) => {
        logs[type].push(message.join(' '))
    }
    logs = {
        log: [],
        warn: [],
        error: []
    }
    originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error
    }
    console.log = mockLog('log')
    console.warn = mockLog('warn')
    console.error = mockLog('error')
}

function enableOutput () {
    if (process.env.FULL_OUTPUT) {
        return
    }
    console.log = originalConsole.log
    console.warn = originalConsole.warn
    console.error = originalConsole.error
}
