const addContext = require('mochawesome/addContext')
const expect = require('chai').expect
const fs = require('fs')

suite('Multi Context Suite', function() {
    test('Multi Context Test', function() {
        addContext(this, 'hello')
        addContext(this, 'world')
        expect(1).to.be.equal(1);
    })
})
