interface Canvas {
    offsetLeft: number
    offsetTop: number
    offsetWidth: number
    offsetHeight: number
    getContext: Function
    addEventListener: Function
    removeEventListener: Function
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

interface Ws {
    send: Function
}

interface Event {
    clientX: number
    clientY: number
}

export default class Draw {
    uuid: number
    ws: Ws
    isDrawing: boolean
    color: string
    thickness: number
    canvas: any
    context: Context
    offset: {
        x: number
        y: number
    }

    constructor(canvas: any, ws: Ws) {
        this.uuid = 0
        this.ws = ws
        this.isDrawing = false
        this.color = '#000'
        this.thickness = 1
        this.canvas = canvas
        this.context = canvas.getContext('2d')
        this.offset = {
            x: this.canvas.offsetLeft,
            y: this.canvas.offsetTop
        }

        this.drawStart = this.drawStart.bind(this)
        this.drawing = this.drawing.bind(this)
        this.drawEnd = this.drawEnd.bind(this)
    }

    init(uuid: number) {
        console.log('我初始化了哦')
        this.uuid = uuid

        this.canvas.addEventListener('mousedown', this.drawStart)
        this.canvas.addEventListener('mouseup', this.drawEnd)
        this.canvas.addEventListener('mouseleave', () => {
            if (this.isDrawing) {
                this.drawEnd()
            }
        })
    }

    setColor(color: string) {
        this.color = color
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
    }

    setThickness(thickness: number) {
        this.thickness = thickness
    }

    drawStart(e: Event) {
        console.log('开始画画了')
        this.context.strokeStyle = this.color
        this.context.lineWidth = this.thickness
        const x = e.clientX - this.offset.x
        const y = e.clientY - this.offset.y

        this.context.beginPath()
        this.context.moveTo(x, y)

        this.canvas.addEventListener('mousemove', this.drawing)

        this.ws.send(JSON.stringify({
            uuid: this.uuid,
            messageType: 10,
            state: 1,
            strokeStyle: this.color,
            lineWidth: this.thickness,
            point: { x, y }
        }))
    }

    drawing(e: Event) {
        this.isDrawing = true
        const x = e.clientX - this.offset.x
        const y = e.clientY - this.offset.y
        this.context.lineTo(x, y)

        this.context.stroke()

        this.ws.send(JSON.stringify({
            uuid: this.uuid,
            messageType: 10,
            state: 2,
            point: { x, y }
        }))
    }

    drawEnd() {
        this.isDrawing = false
        this.canvas.removeEventListener('mousemove', this.drawing)

        this.ws.send(JSON.stringify({
            uuid: this.uuid,
            messageType: 10,
            state: 3
        }))
    }
}
