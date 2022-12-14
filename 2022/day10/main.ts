import * as fs from 'fs'

const poi = [20, 60, 100, 140, 180, 220] as const

const part1 = (instructions: string[][]) => {
    let cycleCounter = 0
    let registerValue = 1
    let finalValue = 0
    const isCurrentCyclePOI = (cycle: number) => {
        return poi.find(v => v == cycle) || 0
    }
    const handleCycle = () => {
        cycleCounter += 1
        if(!!isCurrentCyclePOI(cycleCounter)) {
            console.log(cycleCounter, "addx1")
            finalValue += cycleCounter * registerValue
        }
    }
    const addx = (val: number) => {
        handleCycle()
        handleCycle()
        registerValue += val
    }
    const noop = () => {
        handleCycle()
    }
    for (let [instruction, value] of instructions) {
        switch(instruction) {
            case "addx": {
                const val = parseInt(value)
                addx(val)
                break
            }
            case "noop": {
                noop()
                break
            }
        }
    }
    console.log(finalValue)
}

const creatExampleBoard = (h: number, w: number) => {
    const example: string[][] = []
    for (let i = 0; i < w; i++) {
        example[i] = new Array<string>(h)
        for(let j = 0; j < h; j++) {
            example[i][j] = "."
        }
    }
    return example
}

type Vec2 = [number, number]

const part2 = (instructions: string[][]) => {
    const board = creatExampleBoard(6, 40)
    let cycleCounter = 0
    let registerValue = 1
    let finalValue = 0
    const isCurrentCyclePOI = (cycle: number) => {
        return poi.find(v => v == cycle) || 0
    }
    const handleCycle = () => {
        cycleCounter += 1
        if(!!isCurrentCyclePOI(cycleCounter)) {
            finalValue += cycleCounter * registerValue
        }
    }
    const shouldDraw = () => {
        const [x, y]: Vec2 = [(cycleCounter % 40)-1, Math.floor(cycleCounter / 40) ]
        let pixelStatus = '.'
        if (x == (registerValue - 1) || x == registerValue || x == (registerValue + 1)) {
            pixelStatus = '#'
        }
        board[y][x] = pixelStatus
    }
    const addx = (val: number) => {
        handleCycle()
        shouldDraw()
        handleCycle()
        shouldDraw()
        registerValue += val
    }
    const noop = () => {
        handleCycle()
        shouldDraw()
    }
    for (let [instruction, value] of instructions) {
        switch(instruction) {
            case "addx": {
                const val = parseInt(value)
                addx(val)
                break
            }
            case "noop": {
                noop()
                break
            }
        }
    }
    console.log(board.map(row => row.join("")))
}

const main = () => {
    const data = fs.readFileSync("input.txt", "utf-8").split("\n").map(line => line.split(" "))
    part2(data)
}

main()