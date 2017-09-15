export default class Draw {
    constructor(canvas, ws) {
        this.uuid = 0
        this.ws = ws
        this.isDrawing = false
        this.color = '#000'
        this.thickness = 1
        this.canvas = canvas
        this.context = canvas.getContext('2d')
        this.offset = {
            x: canvas.offsetLeft,
            y: canvas.offsetTop
        }

        this.drawStart = this.drawStart.bind(this)
        this.drawing = this.drawing.bind(this)
        this.drawEnd = this.drawEnd.bind(this)
    }

    init(uuid) {
        this.uuid = uuid

        this.canvas.addEventListener('mousedown', this.drawStart)
        this.canvas.addEventListener('mouseup', this.drawEnd)
        this.canvas.addEventListener('mouseleave', () => {
            if (this.isDrawing) {
                this.drawEnd()
            }
        })
    }

    setColor(color) {
        this.color = color
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
    }

    setThickness(thickness) {
        this.thickness = thickness
    }

    drawStart(e) {
        this.context.strokeStyle = this.color
        this.context.lineWidth = this.thickness
        const x = e.clientX - this.offset.x
        const y = e.clientY - this.offset.y

        this.context.beginPath()
        this.context.moveTo(x, y)

        this.canvas.addEventListener('mousemove', this.drawing)

        this.ws.send(JSON.stringify({
            uuid: this.uuid,
            messageType: 1,
            state: 1,
            strokeStyle: this.color,
            lineWidth: this.thickness,
            point: { x, y }
        }))
    }

    drawing(e) {
        this.isDrawing = true
        const x = e.clientX - this.offset.x
        const y = e.clientY - this.offset.y
        this.context.lineTo(x, y)

        this.context.stroke()

        this.ws.send(JSON.stringify({
            uuid: this.uuid,
            messageType: 1,
            state: 2,
            point: { x, y }
        }))
    }

    drawEnd() {
        this.isDrawing = false
        this.canvas.removeEventListener('mousemove', this.drawing)

        this.ws.send(JSON.stringify({
            uuid: this.uuid,
            messageType: 1,
            state: 3
        }))
    }
}
