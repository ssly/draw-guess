export default class Guess {
    constructor(canvas, ws) {
        this.uuid = 0
        this.ws = ws
        this.strokeStyle = ''
        this.lineWidth = ''

        this.canvas = canvas
        this.context = canvas.getContext('2d')
        this.offset = {
            x: canvas.offsetLeft,
            y: canvas.offsetTop
        }
    }

    init(uuid) {
        this.uuid = uuid
    }

    drawing(data) {
        console.log(data)
        switch (data.state) {
        case 1:
            this.context.beginPath()
            this.context.moveTo(data.point.x, data.point.y)
            this.context.strokeStyle = data.strokeStyle
            this.context.lineWidth = data.lineWidth
            break
        case 2:
            this.context.lineTo(data.point.x, data.point.y)
            this.context.stroke()
            break
        default:
        }
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
    }
}
