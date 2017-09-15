function jsonToObject(json: string):object {
    let object
    try {
        object = JSON.parse(json)
    } catch (e) {
        console.log('parse json error.')
    }
    return object
}

export { jsonToObject }