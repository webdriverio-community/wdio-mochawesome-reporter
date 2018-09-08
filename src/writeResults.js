import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'

// outputs json and html reports
export default function (json, options) {
    if (!options || typeof options.outputDir !== 'string') {
        return console.log(`Cannot write json report: empty or invalid 'outputDir'.`)
    }

    try {
        const dir = path.resolve(options.outputDir)
        const filename = options.mochawesome_filename ? options.mochawesome_filename : 'wdiomochawesome.json'
        const filepath = path.join(dir, filename)
        mkdirp.sync(dir)
        fs.writeFileSync(filepath, JSON.stringify(json))
        console.log(`Wrote json report to [${options.outputDir}].`)
    } catch (e) {
        console.log(`Failed to write json report to [${options.outputDir}]. Error: ${e}`)
    }
}
