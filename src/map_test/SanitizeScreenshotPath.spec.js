const SanitizeScreenshotPath = require('./SanitizeScreenshotPath')
const path = require('path')

describe('SanitizeScreenshotPath Unit Tests', function () {
    it('Should return a relative path', function () {
        const opts = {
            screenshotUseRelativePath: true,
            outputDir: '/Results/screenshots'
        }
        expect(SanitizeScreenshotPath(opts)).toBe('Results/screenshots')
    })

    it('Should return a absolute path', function () {
        const opts = {
            screenshotUseRelativePath: false,
            outputDir: './Results/screenshots'
        }
        expect(SanitizeScreenshotPath(opts)).toBe(`${path.join(__dirname, '../../')}Results/screenshots`)
    })
})
