interface Canvas {
    offsetLeft: number
    offsetTop: number
    offsetWidth: number
    offsetHeight: number
    getContext: Function
}

interface Context {
    strokeStyle: string
    lineWidth: number
    beginPath: Function
    moveTo: Function
    lineTo: Function
    stroke: Function
    clearRect: Function
}

/**
 * 数据对象
 */
interface JsonObject {
    state: number
    point: {
        x: number
        y: number
    }
    strokeStyle: string
    lineWidth: number
}

export default class Guess {
    uuid: number
    ws: object
    strokeStyle: string
    lineWidth: number
    canvas: Canvas
    context: Context
    offset: object

    constructor(canvas: any, ws: object) {
        this.uuid = 0
        this.ws = ws
        this.strokeStyle = ''
        this.lineWidth = 1

        this.canvas = canvas
        this.context = this.canvas.getContext('2d')
        this.offset = {
            x: canvas.offsetLeft,
            y: canvas.offsetTop
        }
    }

    init(uuid: number) {
        this.uuid = uuid
    }

    drawing(data: JsonObject) {
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
