const apiKey = process.env.LOGENTRIES_API_KEY
const apiKeyId = process.env.LOGENTRIES_API_KEY_ID

const crypto = require('crypto')
const httpClient = require('good-guy-http')()
const util = require('util')
const _ = require('lodash')

const generateSignature = require('./generateSignature')
const tagsRequests = require('./tagsRequests')(httpClient, generateSignature, crypto, apiKey, apiKeyId)

const reflectPromise = require('./utils').reflectPromise
const createMapFromArray = require('./utils').createMapFromArray
const checkApiKey = require('./utils').checkApiKey


module.exports = (configuration, createNotExisting=true,
                  updateExisting=false, deleteNotIncluded=false) => {

    if(checkApiKey(apiKey)) throw Error(`LOGENTRIES_API_KEY is not defined or has wrong pattern`)
    if(checkApiKey(apiKeyId)) throw Error(`LOGENTRIES_API_KEY_ID is not defined or has wrong pattern`)

    const configurationTagsNames = configuration.map(tag => tag.name)
    const configurationTagsMap = createMapFromArray(configuration, 'name')

    return tagsRequests.getAllTags()
        .then(response => {
            const body = JSON.parse(response.body)
            const currentTagsNames = body.tags.map(tag => tag.name)
            const currentTagsMap = createMapFromArray(body.tags, 'name')

            return {currentTagsMap, currentTagsNames}
        }).then(result => {
            let currentTagsMap, currentTagsNames
            ({currentTagsMap, currentTagsNames} = result)

            const tagsNamesToUpdate = _.intersection(currentTagsNames, configurationTagsNames)
            const tagsNamesToDelete = _.difference(currentTagsNames, configurationTagsNames)
            const tagsNamesToCreate = _.difference(configurationTagsNames, currentTagsNames)

            return {
                tagsNamesToCreate, tagsNamesToUpdate,
                tagsNamesToDelete, currentTagsMap
            }
        }).then(result => {
            let tagsNamesToCreate, tagsNamesToUpdate, tagsNamesToDelete, currentTagsMap
            ({tagsNamesToCreate, tagsNamesToUpdate, tagsNamesToDelete, currentTagsMap} = result)

            let requests = []

            if (createNotExisting) {
                tagsNamesToCreate.forEach(name => {
                    requests.push(tagsRequests.createTag(configurationTagsMap[name]))
                })
            }

            if (updateExisting) {
                tagsNamesToUpdate.forEach(name => {
                    requests.push(tagsRequests.updateTag(currentTagsMap[name]))
                })
            }

            if (deleteNotIncluded) {
                tagsNamesToDelete.forEach(name => {
                    requests.push(tagsRequests.deleteTag(currentTagsMap[name].id))
                })
            }

            return Promise.all(requests.map(reflectPromise))
        }).catch(err => {
            console.log(err)
        })
}
