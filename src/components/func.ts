interface Message {
    messageType?: string;
    uuid?: string;
    roomId?: number;
}

function jsonToObject(json: string): Message {
    let object: Message
    try {
        return JSON.parse(json)
    } catch (e) {
        console.log('parse json error.')
    }
    return {}
}

export { jsonToObject }