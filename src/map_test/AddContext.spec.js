import AddContext from './AddContext'
const expect = require('chai').expect

describe('AddContext Unit Tests', function () {
    it('Should return context with a the valid Session ID', function () {
        let context = AddContext({}, {}, '', 'abc123')

        expect(context.length).to.equal(1)
        expect(context[0].title).to.equal('Session Id')
        expect(context[0].value).to.equal('abc123')
    })

    it('Should return context provided by a test', function () {
        const data = {
            context: {
                title: 'sample context',
                value: 'this is a test'
            }
        }
        let context = AddContext(data, {}, '', 'abc123')
        expect(context.length).to.equal(2)
        expect(context[0].title).to.equal('Session Id')
        expect(context[0].value).to.equal('abc123')
        expect(context[1].title).to.equal('sample context')
        expect(context[1].value).to.equal('this is a test')
    })

    it('Should return multiple context provided by a test', function () {
        const data = {
            context: [{
                title: 'sample context',
                value: 'this is a test'
            },
            {
                title: 'sample context2',
                value: 'another test'
            }]
        }
        let context = AddContext(data, {}, '', 'abc123')
        expect(context.length).to.equal(3)
        expect(context[0].title).to.equal('Session Id')
        expect(context[0].value).to.equal('abc123')
        expect(context[1].title).to.equal('sample context')
        expect(context[1].value).to.equal('this is a test')
        expect(context[2].title).to.equal('sample context2')
        expect(context[2].value).to.equal('another test')
    })

    it('Should return screenshots as context when file name does not include path', function () {
        const mochawesomOpts = { includeScreenshots: true }
        const data = {
            output: [{
                type: 'screenshot',
                payload: {
                    filename: 'test.png'
                }
            }]
        }

        let context = AddContext(data, mochawesomOpts, '/users/jim', 'abc123')
        expect(context.length).to.equal(2)
        expect(context[0].title).to.equal('Session Id')
        expect(context[0].value).to.equal('abc123')
        expect(context[1].title).to.equal('Screenshot: test.png')
        expect(context[1].value).to.equal('/users/jim/test.png')
    })

    it('Should return screenshots as context when file name does include path', function () {
        const mochawesomOpts = { includeScreenshots: true }
        const data = {
            output: [{
                type: 'screenshot',
                payload: {
                    filename: '/users/jim/test.png'
                }
            }]
        }

        let context = AddContext(data, mochawesomOpts, '/users/jim', 'abc123')
        expect(context.length).to.equal(2)
        expect(context[0].title).to.equal('Session Id')
        expect(context[0].value).to.equal('abc123')
        expect(context[1].title).to.equal('Screenshot: test.png')
        expect(context[1].value).to.equal('/users/jim/test.png')
    })

    it('Should not return screenshots as context when the option is on but no screenshots were taken', function () {
        const mochawesomOpts = { includeScreenshots: true }
        const data = {
            output: [{}]
        }

        let context = AddContext(data, mochawesomOpts, '/users/jim', 'abc123')
        expect(context.length).to.equal(1)
        expect(context[0].title).to.equal('Session Id')
        expect(context[0].value).to.equal('abc123')
    })
})
