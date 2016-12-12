const chai = require('chai')
const assert = chai.assert
const proxyquire = require('proxyquire')


describe('LogEntresto base usage', () => {

    process.env.LOGENTRIES_API_KEY = '12345678-1234-1234-1234-123456781234'
    process.env.LOGENTRIES_API_KEY_ID = '12345678-1234-1234-1234-123456781234'

    const userConfigurationMock = [{name: 'tag3'}, {name: 'tag4'},
                                   {name: 'tag5'}, {name: 'tag6'}]

    const serverConfigurationMock = [{name: 'tag1', id: 1}, {name: 'tag2', id: 2},
                                     {name: 'tag3', id: 3}, {name: 'tag4', id: 4}]

    const tagsRequestsStub = () => ({
        getAllTags: () =>  Promise.resolve({body: JSON.stringify({tags: serverConfigurationMock})}),
        createTag: tag => Promise.resolve({action: 'create', content: tag}),
        updateTag: tag => Promise.resolve({action: 'update', content: tag}),
        deleteTag: tagId => Promise.resolve({action: 'delete', content: tagId})
    })

    const logEntresto = proxyquire('../lib/logEntresto', {'./tagsRequests': tagsRequestsStub})

    it('should create tags that are not included in user configuration', done => {
        logEntresto(userConfigurationMock)
            .then(result => {
                assert.deepEqual(result, [ { result: { action: 'create', content: {name: "tag5"} },
                                             status: 'resolved' },
                                           { result: { action: 'create', content: {name: "tag6"} },
                                             status: 'resolved' } ])
            })
            .then(done)
            .catch(done)
    })

    it('should update tags that are included in both user and server configuration', done => {
        logEntresto(userConfigurationMock, false, true)
            .then(result => {
                assert.deepEqual(result, [
                    { result: { action: 'update', content: {id: 3, name: "tag3"} }, status: 'resolved' },
                    { result: { action: 'update', content: {id: 4, name: "tag4"} }, status: 'resolved' }
                ])
            })
            .then(done)
            .catch(done)
    })

    it('should delete tags that are included in server configuration and not in user configuration', done => {
        logEntresto(userConfigurationMock, false, false, true)
            .then(result => {
                assert.deepEqual(result, [
                    { result: { action: 'delete', content: 1 }, status: 'resolved' },
                    { result: { action: 'delete', content: 2 }, status: 'resolved' }
                ])
            })
            .then(done)
            .catch(done)
    })

    it('should handle create/update/delete operations at once', done => {
        logEntresto(userConfigurationMock, true, true, true)
            .then(result => {
                assert.deepEqual(result, [
                    { result: { action: 'create', content: {name: "tag5"} }, status: 'resolved' },
                    { result: { action: 'create', content: {name: "tag6"} }, status: 'resolved' },
                    { result: { action: 'update', content: {id: 3, name: "tag3"} }, status: 'resolved' },
                    { result: { action: 'update', content: {id: 4, name: "tag4"} }, status: 'resolved' },
                    { result: { action: 'delete', content: 1 }, status: 'resolved' },
                    { result: { action: 'delete', content: 2 }, status: 'resolved' },
                ])
            })
            .then(done)
            .catch(done)
    })

})