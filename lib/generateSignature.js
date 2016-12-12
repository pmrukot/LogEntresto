module.exports = (crypto, apiKey, apiKeyId, date, method, path, body) => {
    const contentType = "application/json"

    const hashedBody = crypto.createHash("sha256")
        .update(body)
        .digest("base64")

    const canonicalString = method + contentType + date + path + hashedBody

    return apiKeyId + ":" + crypto.createHmac("sha1", apiKey)
        .update(canonicalString)
        .digest()
        .toString("base64")
}
