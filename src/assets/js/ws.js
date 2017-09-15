export default class Ws {
    constructor(url) {
        this.url = url
    }

    init() {
        const ws = new WebSocket(this.url)
        ws.onopen = this.onopen
        ws.onmessage = this.onmessage
    }

    onopen() {
        console.log('打开了')
    }

    onmessage() {

    }
}
