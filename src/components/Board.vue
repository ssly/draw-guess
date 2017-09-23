<template>
    <div>
        <div class="start-container">
            <button :disabled="!checkCanStart(clientArray)" @click="startGame">开始游戏</button>
            <button @click="clearCanvas">清除画板</button>
            <button @click="readyGame">{{user.ready?'取消准备':'准备'}}</button>
        </div>
        <div class="canvas-container">
            <canvas ref="canvas" width="500" height="400"></canvas>
        </div>
        <div class="draw-container">
            <div class="pencel-container">
                <div class="pencel" :style="pencelStyle"></div>
            </div>
            <div class="line-container">
                <div v-for="t in thicknessArray" :key="t" :class="['line', `thinkness-${t}`]" @click="changeThickness(t)"></div>
            </div>
            <div class="color-container">
                <div v-for="c in colorArray" :key="c" :class="['color', `color-${c}`]" @click="changeColor(c)"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import Draw from '../assets/js/draw'
import Guess from '../assets/js/guess'

const colorArray = ['black', 'red', 'orange', 'yellow', 'green', 'blue', 'purple']
const thicknessArray = [1, 3, 6]

interface User {
    roomId: number;
    uuid: string;
    currentPlayer?: string;
    ready?: boolean;
}

interface Message {
    messageType: number;
    roomId: number;
    uuid: string;
    user: User[];
}

interface Ws {
    send: Function;
    onopen(event: Event): void;
    onmessage(event: MessageEvent): void;
    onclose(event: CloseEvent): void;
    onerror(event: ErrorEvent): void;
}

@Component
export default class Board extends Vue {
    client = 0

    ws: Ws
    clientArray: User[] = []
    user: User = { roomId: 0, uuid: '' }
    player: any
    thicknessArray = thicknessArray
    colorArray = colorArray
    strokeStyle = '#000'
    thinkness = 1

    get pencelStyle() {
        const thinkness = this.thinkness === 1 ? '0.12rem' : this.thinkness === 3 ? '0.15rem' : '0.2rem'

        return {
            width: thinkness,
            height: thinkness,
            background: this.strokeStyle
        }
    }

    changeColor(color: string) {
        console.log(color)
        this.strokeStyle = color
        // this.user.setColor(color)
    }

    changeThickness(thickness: number) {
        console.log(thickness)
        this.thinkness = thickness
        // this.user.setThickness(thickness)
    }

    readyGame() {
        const ready = !this.user.ready
        console.log(this.user.uuid)
        this.ws.send(JSON.stringify({
            messageType: 1,
            roomId: this.user.roomId,
            uuid: this.user.uuid,
            ready,
            start: false
        }))
    }

    startGame() {
        this.ws.send(JSON.stringify({
            messageType: 2,
            uuid: this.user.uuid,
            start: true
        }))
    }

    clearCanvas() {
        // this.user.clearCanvas()
    }

    /**
     * 检查是否能开始游戏，准备人数超过两人
     */
    checkCanStart(user: User[]): boolean {
        if (!Array.isArray(user)) {
            return false
        }
        let canStart: boolean

        // 至少需要两个人才能开始
        if (user.length >= 2) {
            canStart = true
        } else {
            canStart = false
        }

        user.forEach(item => {
            if (!item.ready) {
                canStart = false
                return
            }
        })

        return canStart
    }

    mounted() {
        this.ws = new WebSocket('ws://localhost:8099')

        this.ws.onopen = () => {
            // connect successfully, register client
            this.ws.send(JSON.stringify({
                messageType: 0,
                roomId: 1000
            }))
        }

        this.ws.onmessage = (response: MessageEvent) => {
            let message: Message
            try {
                message = JSON.parse(response.data)
            } catch (e) {
                throw new Error('response is not json.')
            }

            switch (message.messageType) {
                case 0:
                    this.user.uuid = message.uuid
                    this.user.roomId = message.roomId
                    break
                case 1:
                    message.user.forEach(item => {
                        if (item.uuid === this.user.uuid) {
                            this.user.ready = item.ready
                        }
                    })
                    break
                case 2: // 游戏开始
                    if (this.user.currentPlayer === this.user.uuid) {
                        this.player = new Draw(this.$refs.canvas, this.ws)
                    } else {
                        this.player = new Guess(this.$refs.canvas, this.ws)
                    }
                    this.player.init(this.user.uuid)
                    break
                case 99:
                    break
                default:
            }
            this.clientArray = message.user
        }
    }
}
</script>

<style scoped lang="less">
@import './board.less';
</style>
