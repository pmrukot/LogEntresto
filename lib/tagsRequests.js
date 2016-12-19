module.exports = (httpClient, apiKey) => {

    const logentriesRestUrl = "https://rest.logentries.com/"
    const headers = {
        "x-api-key": apiKey,
        "Content-Type": "application/json"
    }

    const tagsRequests = {}

    tagsRequests.getAllTags = () => {
        const method = "GET"
        const path = "management/tags"
        const url = logentriesRestUrl + path

        return httpClient({method, url, headers})
    }

    tagsRequests.getTag = tagId => {
        const method = "GET"
        const path = "management/tags/" + tagId
        const url = logentriesRestUrl + path

        return httpClient({method, url, headers})
    }

    tagsRequests.createTag = tag => {
        const method = "POST"
        const path = "management/tags"
        const url = logentriesRestUrl + path
        const body = JSON.stringify({tag})

        return httpClient({method, url, headers, body})
    }

    tagsRequests.updateTag = tag => {
        const method = "PUT"
        const path = "management/tags/" + tag.id
        const url = logentriesRestUrl + path
        const body = JSON.stringify({tag})

        return httpClient({method, url, headers, body})
    }

    tagsRequests.deleteTag = tagId => {
        const method = "DELETE"
        const path = "management/tags/" + tagId
        const url = logentriesRestUrl + path

        return httpClient({method, url, headers})
    }

    return tagsRequests
}
