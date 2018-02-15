const addContext = require('mochawesome/addContext')
const expect = require('chai').expect
const fs = require('fs')

suite('Multi Context Suite', function() {
    test('Multi Context Test', function() {
        addContext(this, 'content provided to addContext')
        browser.url('https://www.google.com')
        var screenshotName = 'sample.png'
        var screenshot = browser.saveScreenshot(screenshotName)
        fs.writeFileSync(screenshotName,screenshot)
        fs.unlinkSync(screenshotName)
    })
})
