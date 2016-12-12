module.exports = {
    checkApiKey: key => {
        const apiKeyPattern = new RegExp('^([0-9]|[a-f]){8}\-(([0-9]|[a-f]){4}\-){3}([0-9]|[a-f]){12}$')
        return !apiKeyPattern.test(key)
    },
    createMapFromArray: (array, key) => {
        let resultMap = {}
        let arrayKeys = array.map(obj => obj[key])

        for (let idx = 0; idx < arrayKeys.length; idx++) {
            resultMap[arrayKeys[idx]] = array[idx]
        }

        return resultMap
    },
    reflectPromise: promise => {
        return promise.then(
            result => ({result, status: 'resolved'}),
            result => ({result, status: 'rejected'})
        )
    }
}