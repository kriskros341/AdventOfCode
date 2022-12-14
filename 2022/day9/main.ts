import * as fs from 'fs'

type Vec2 = [number, number]
type Side = 'U' | 'D' | 'L' | 'R'
type Instruction = [Side, number]

const add_vec2 = (v1: Vec2, v2: Vec2): Vec2 => {
    return v1.map((_, idx) => v1[idx] + v2[idx]) as Vec2
}

const smul_vec2 = (v1: Vec2, val: number): Vec2 => {
    return v1.map((v) => v * val) as Vec2
}


const sideDirectionTranslation = new Map<Side, Vec2>([
    ['L', [-1, 0]],
    ['R', [1, 0]],
    ['U', [0, 1]],
    ['D', [0, -1]],
])

const distantVertically = (Head: Vec2, Tail: Vec2): boolean => {
    return Math.abs(Head[1] - Tail[1]) > 1

}

const distantHorizontally = (Head: Vec2, Tail: Vec2): boolean => {
    return Math.abs(Head[0] - Tail[0]) > 1
}

const delta = (n1: number, n2: number) => {
    return Math.abs(n1 - n2)
}

const distantDiagonally = (Head: Vec2, Tail: Vec2): boolean => {
    const dy = delta(Head[1], Tail[1])
    const dx = delta(Head[0], Tail[0])
    return (dy > 1 && dx == 1) || (dy == 1 && dx > 1)
}

const DiscreteAvg = (v1: Vec2, v2: Vec2): Vec2 => {
    let dx = v1[0] + v2[0]
    let dy = v1[1] + v2[1]
    dx = dx > 0 ? dx + 1 : dx - 1 
    dy = dy > 0 ? dy + 1 : dy - 1 

    return [Math.floor(dx / 2), Math.floor(dy / 2)]
}
const Distance = (v1: Vec2, v2: Vec2) => {
    return Math.sqrt((v1[0]-v2[0])*(v1[0]-v2[0]) + (v1[1]-v2[1])*(v1[1]-v2[1]))
}

const part1 = (instructions: Instruction[]) => {
    let Head: Vec2 = [0, 0]
    let Tail: Vec2 = [0, 0]
    let board = creatExampleBoard(6, 6)
    const refreshBoard = () => {
        board = creatExampleBoard(6, 6)
        board[Head[0]][Head[1]] = 'H'
        board[Tail[0]][Tail[1]] = 'T'
        console.log(Head, Tail)
    }
    const positionMemory = new Set<string>([])
    const recordPositin = (Knot: Vec2) => {
        const serialized = Knot[0].toString() + " " + Knot[1].toString()
        positionMemory.add(serialized)
    }
    const handleHeadMovement = (side: Side) => {
        const direction = sideDirectionTranslation.get(side)!
        Head = add_vec2(Head, direction)
        console.log(Distance(Head, Tail))
        if(Distance(Head, Tail) > 1.5) {
            Tail = DiscreteAvg(Head, Tail)
            recordPositin(Tail)
        }
        refreshBoard()
        console.log(board.reverse())
    }
    recordPositin(Tail)
    for (let [side, distance] of instructions) {
        for(let _ = 0; _ < distance; _++) {
            handleHeadMovement(side)
        }

    }
    console.log(positionMemory.size)
}

const creatExampleBoard = (w: number, h: number) => {
    const example: string[][] = []
    for (let i = 0; i < h; i++) {
        example[i] = new Array<string>(w)
        for(let j = 0; j < w; j++) {
            example[i][j] = "."
        }
    }
    return example
}

const sub_vec2 = (v1: Vec2, v2: Vec2) => {
    return v1.map((_, idx) => v1[idx] - v2[idx]) as Vec2

}

class Knot {
    symbol: string
    position: Vec2
    constructor(symbol: string) {
        this.symbol = symbol
        this.position = [0, 0]
    }
    alterPosition(add: Vec2) {
        this.position = add_vec2(this.position, add)
    }
}

const part2 = (instructions: Instruction[]) => {
    const board = creatExampleBoard(6, 5)


    let Tail: Knot[] = []
    let Head: Knot = new Knot("H")
    for (let i = 1; i < 10; i++) {
        Tail.push(new Knot(i.toString()))
    }
    const propagateMovement = (Tail: Knot[]) => {
        for (let i = 1; i < 9; i++) {
            const current = Tail[i]
            const previous = Tail[i-1]
            const expectedDisplacement = sub_vec2(previous.position, current.position)
            switch(true) {
                case distantDiagonally(current.position, previous.position): {
                    Tail[i].position = add_vec2(current.position, expectedDisplacement)
                    break;
                }
                case distantVertically(current.position, previous.position): {
                    const sign = (expectedDisplacement[1] / Math.abs(expectedDisplacement[1]))
                    Tail[i].position = add_vec2(current.position, smul_vec2([0, 1], sign))
                    break;
                }
                case distantHorizontally(current.position, previous.position): {
                    const sign = (expectedDisplacement[0] / Math.abs(expectedDisplacement[0]))
                    Tail[i].position = add_vec2(current.position, smul_vec2([1, 0], sign))
                    break;
                }
            }
            console.log(Tail[i], Tail[i-1])
        }
    }
    const handleHeadMovement = (side: Side) => {
        const direction = sideDirectionTranslation.get(side)!
        Head.alterPosition(direction)
        switch(true) {
            case distantDiagonally(Head.position, Tail[0].position): {
                Tail[0].position = add_vec2(Head.position, smul_vec2(direction, -1))
                break;
            }
            case distantVertically(Head.position, Tail[0].position): {
                Tail[0].position = add_vec2(Tail[0].position, direction)
                break;
            }
            case distantHorizontally(Head.position, Tail[0].position): {
                Tail[0].position = add_vec2(Tail[0].position, direction)
                break;
            }
        }
        propagateMovement(Tail)
        console.log(Tail)
    }
    for (let [side, distance] of instructions) {
        for(let _ = 0; _ < distance; _++) {
            handleHeadMovement(side)
        }
    }
}

const main = () => {
    const data = fs.readFileSync("input.txt", "utf-8").split("\n")
    const instructions = data.map(line => line.split(' ')).map(pair => [pair[0], parseInt(pair[1])] as Instruction)
    part1(instructions)
}

main()