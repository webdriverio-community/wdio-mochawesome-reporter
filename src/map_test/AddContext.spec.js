const AddContext = require('./AddContext')

describe('AddContext Unit Tests', function () {
    it('Should return context with a the valid Session ID', function () {
        let context = AddContext({}, {}, 'abc123')

        expect(context.length).toBe(1)
        expect(context[0].title).toBe('Session Id')
        expect(context[0].value).toBe('abc123')
    })

    it('Should return context provided by a test', function () {
        const data = {
            context: {
                title: 'sample context',
                value: 'this is a test'
            }
        }
        let context = AddContext(data, {}, 'abc123')
        expect(context.length).toBe(2)
        expect(context[0].title).toBe('Session Id')
        expect(context[0].value).toBe('abc123')
        expect(context[1].title).toBe('sample context')
        expect(context[1].value).toBe('this is a test')
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
        let context = AddContext(data, {}, 'abc123')
        expect(context.length).toBe(3)
        expect(context[0].title).toBe('Session Id')
        expect(context[0].value).toBe('abc123')
        expect(context[1].title).toBe('sample context')
        expect(context[1].value).toBe('this is a test')
        expect(context[2].title).toBe('sample context2')
        expect(context[2].value).toBe('another test')
    })

    it('Should return screenshots as context when file name does not include path', function () {
        const opts = {
            includeScreenshots: true,
            outputDir: '/users/jim'
        }
        const data = {
            output: [{
                type: 'screenshot',
                payload: {
                    filename: 'test.png'
                }
            }]
        }

        let context = AddContext(data, opts, 'abc123')
        expect(context.length).toBe(2)
        expect(context[0].title).toBe('Session Id')
        expect(context[0].value).toBe('abc123')
        expect(context[1].title).toBe('Screenshot: test.png')
        expect(context[1].value).toBe('/users/jim/test.png')
    })

    it('Should return screenshots as context when file name does include path', function () {
        const opts = {
            includeScreenshots: true,
            outputDir: '/users/jim'
        }
        const data = {
            output: [{
                type: 'screenshot',
                payload: {
                    filename: '/users/jim/test.png'
                }
            }]
        }

        let context = AddContext(data, opts, 'abc123')
        expect(context.length).toBe(2)
        expect(context[0].title).toBe('Session Id')
        expect(context[0].value).toBe('abc123')
        expect(context[1].title).toBe('Screenshot: test.png')
        expect(context[1].value).toBe('/users/jim/test.png')
    })

    it('Should not return screenshots as context when the option is on but no screenshots were taken', function () {
        const opts = {
            includeScreenshots: true,
            outputDir: '/users/jim'
        }
        const data = {
            output: [{}]
        }

        let context = AddContext(data, opts, 'abc123')
        expect(context.length).toBe(1)
        expect(context[0].title).toBe('Session Id')
        expect(context[0].value).toBe('abc123')
    })
})
