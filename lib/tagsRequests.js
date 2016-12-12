module.exports = (httpClient, generateSignature, crypto, apiKey, apiKeyId) => {

    const logentriesRestUrl = "https://rest.logentries.com/"
    const contentType = "application/json"

    const tagsRequests = {}

    tagsRequests.getAllTags = () => {
        console.log('not that')
        const method = "GET"
        const path = "management/tags"
        const url = logentriesRestUrl + path
        const headers = createHeaders(method, path, '')

        return httpClient({method, url, headers})
    }

    tagsRequests.getTag = tagId => {
        const method = "GET"
        const path = "management/tags/" + tagId
        const url = logentriesRestUrl + path
        const headers = createHeaders(method, path, '')

        return httpClient({method, url, headers})
    }

    tagsRequests.createTag = tag => {
        const method = "POST"
        const path = "management/tags"
        const url = logentriesRestUrl + path
        const body = JSON.stringify({tag})
        const headers = createHeaders(method, path, body)

        return httpClient({method, url, headers, body})
    }

    tagsRequests.updateTag = tag => {
        const method = "PUT"
        const path = "management/tags/" + tag.id
        const url = logentriesRestUrl + path
        const body = JSON.stringify({tag})
        const headers = createHeaders(method, path, body)

        return httpClient({method, url, headers, body})
    }

    tagsRequests.deleteTag = tagId => {
        const method = "DELETE"
        const path = "management/tags/" + tagId
        const url = logentriesRestUrl + path
        const headers = createHeaders(method, path, '')

        return httpClient({method, url, headers})
    }


    const createHeaders = (method, path, body) => {
        const date = new Date().toUTCString()
        const signature = generateSignature(crypto, apiKey, apiKeyId, date, method, path, body)

        return {
            "Date": date,
            "Content-Type": contentType,
            "authorization-api-key": signature,
        }
    }

    return tagsRequests
}
