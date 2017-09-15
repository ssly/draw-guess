<template>
    <div>
        <div class="start-container">
            <button :disabled="uuid===1&&client<2" @click="startGame">开始游戏</button>
            <button @click="clearCanvas">清除画板</button>
        </div>
        <div class="canvas-container">
            <canvas ref="canvas" width="500" height="400"></canvas>
        </div>
        <div class="draw-container">
            <div class="pencel-container">
                <div class="pencel" :style="pencelStyle"></div>
            </div>
            <div class="line-container">
                <div v-for="t in thicknessArray" :key="t"
                    :class="['line', `thinkness-${t}`]"
                    @click="changeThickness(t)"></div>
            </div>
            <div class="color-container">
                <div v-for="c in colorArray" :key="c"
                    :class="['color', `color-${c}`]"
                    @click="changeColor(c)"></div>
            </div>
        </div>
    </div>
</template>

<script>
import Draw from '../assets/js/draw'
import Guess from '../assets/js/guess'
import { jsonToObject } from './func.ts'

const colorArray = ['black', 'red', 'orange', 'yellow', 'green', 'blue', 'purple']
const thicknessArray = [1, 3, 6]

export default {
    data() {
        return {
            client: 0,
            uuid: 0,

            ws: null,
            user: null,
            thicknessArray,
            colorArray,
            strokeStyle: '#000',
            thinkness: 1
        }
    },

    computed: {
        pencelStyle() {
            const thinkness = this.thinkness === 1 ? '0.12rem' : this.thinkness === 3 ? '0.15rem' : '0.2rem'

            return {
                width: thinkness,
                height: thinkness,
                background: this.strokeStyle
            }
        }
    },

    methods: {
        changeColor(color) {
            this.strokeStyle = color
            this.user.setColor(color)
        },

        changeThickness(thickness) {
            this.thinkness = thickness
            this.user.setThickness(thickness)
        },

        startGame() {
            this.ws.send(JSON.stringify({
                messageType: 0,
                register: false,
                start: true
            }))
        },

        clearCanvas() {
            this.user.clearCanvas()
        }
    },

    mounted() {
        const ws = new WebSocket('ws://localhost:8099')
        this.ws = ws

        ws.onopen = () => {
            // connect successfully, register client
            ws.send(JSON.stringify({
                messageType: 0,
                register: true,
                start: false
            }))
        }

        ws.onmessage = (response) => {
            const message = jsonToObject(response.data)
            !this.uuid && (this.uuid = message.uuid)
            this.client = message.client

            if (message.start) {
                if (this.uuid === 1) {
                    this.user = new Draw(this.$refs.canvas, ws)
                    console.log('I am draw')
                } else {
                    this.user = new Guess(this.$refs.canvas, ws)
                    console.log('I am guess')
                }
                this.user.init(this.uuid)
            }

            switch (message.messageType) {
            case 1:
                if (this.uuid !== message.uuid) {
                    this.user.drawing(message)
                }
                break
            case 2:
                break
            case 3:
                break
            default:
            }
        }

        ws.onclose = () => {
            // ws.send({
            //     messageType: 99,
            //     uuid: this.uuid
            // })
        }
        ws.onerror = () => {
        }
    }
}
</script>

<style scoped lang="less">
    @import './board.less';
</style>
