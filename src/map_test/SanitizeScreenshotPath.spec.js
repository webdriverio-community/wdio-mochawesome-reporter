import SanitizeScreenshotPath from './SanitizeScreenshotPath'
import path from 'path'
const expect = require('chai').expect

describe('SanitizeScreenshotPath Unit Tests', function () {
    it('Should return a relative path', function () {
        const mochawesomeOpts = {
            screenshotUseRelativePath: true
        }
        expect(SanitizeScreenshotPath(mochawesomeOpts, '/Results/screenshots')).to.equal('Results/screenshots')
    })

    it('Should return a absolute path', function () {
        const mochawesomeOpts = {
            screenshotUseRelativePath: false
        }
        expect(SanitizeScreenshotPath(mochawesomeOpts, './Results/screenshots')).to.equal(`${path.join(__dirname, '../../')}Results/screenshots`)
    })
})
