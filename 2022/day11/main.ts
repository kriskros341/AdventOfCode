import * as fs from 'fs'

const noRe = new RegExp(/\d/)
const itemRe = new RegExp(/\d+/g)
const opRe1 = new RegExp(/: .*/)
const testRe = new RegExp(/\d+/)

class Queue<T>  {
    _list: T[] = []
    constructor(arr: T[]) {
        this._list = arr
    }
    enqueue(item: T) {
        this._list.push(item)
    }
    map(fn: (i: T) => T) {
        return new Queue(this._list.map(fn))
    }
    dequeue() {
        if(this._list.length == 0) {
            throw "queue is empty"
        }
        const item = this._list[0]
        this._list = this._list.slice(1)
        return item
    }
}

const depth1Equal = <T>(arr1: T[], arr2: T[]) => {
    if (arr1.length != arr2.length) {
        return false
    }
    for(let i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i]) {
            return false
        }
    }
    return true
}

class Monkey {
    no: number
    items: Queue<number>
    op: string[]
    testInt: number
    testTrue: number
    testFalse: number
    inspectCounter: number = 0
    constructor(no: number, items: number[], op: string[], testInt: number, testTrue: number, testFalse: number) {
        this.no = no
        this.items = new Queue(items)
        this.op = op
        this.testInt = testInt
        this.testTrue = testTrue
        this.testFalse = testFalse
    }
    *getItems() {
        while(this.items._list.length != 0) {
            yield this.items.dequeue()
        }
    }
    relief(item: number) {
        return Math.floor(item / 3)
    }
    operate(item: number) {
        const operand = this.op[1]
        this.inspectCounter++
        switch(true) {
            case depth1Equal(this.op, ["+", "old"]): {
                return item + item
            }
            case depth1Equal(this.op, ["*", "old"]): {
                return item * item
            }
            case depth1Equal(this.op, ["+", operand]): {
                return item + parseInt(operand)
            }
            case depth1Equal(this.op, ["*", operand]): {
                return item * parseInt(operand)
            }
        }
    }
    testItem(item: number) {
        return item % this.testInt == 0 ? this.testTrue : this.testFalse
    }

    P2reduce(reliefValue: number) {
        this.items = this.items.map(v => v % reliefValue)
    }
}

const createMonkey = (monkeyString: string) => {
    const [
        noStr,
        itemStr,
        operStr,
        testStr,
        testTrueStr,
        testFalseStr
    ] = monkeyString.split("\n")
    const no = parseInt(noStr.match(noRe)?.at(0)!)
    const items = [...itemStr.matchAll(itemRe)].map(match => parseInt(match.at(0)!))
    let [, , , , action, operand] = operStr.match(opRe1)?.at(0)!.split(" ")!
    const operation = [action, operand]
    const test = parseInt(testStr.match(testRe)?.at(0)!)
    const testTrue = parseInt(testTrueStr.match(testRe)?.at(0)!)
    const testFalse = parseInt(testFalseStr.match(testRe)?.at(0)!)
    return new Monkey(no, items, operation, test, testTrue, testFalse)
}

const getNMax = (arr: number[], N: number) => {
    if(arr.length < N) {
        throw "N"
    }
    const sorted = arr.sort((a, b) => a - b)
    console.log(sorted)
    return sorted.reverse().slice(0, N)
}//

const product = (arr: number[]) => {
    return arr.reduce((t, n) => t * n)
}

const part1 = (monkeys: Monkey[]) => {
    monkeys.forEach(m => console.log(m))
    for(let iter = 0; iter < 1; iter++) {
        for(let monkey of monkeys) {
            for(let item of monkey.getItems()) {
                const newVal = monkey.operate(item)!
                const relieved = monkey.relief(newVal)
                const newMonkey = monkey.testItem(relieved)
                monkeys[newMonkey].items.enqueue(relieved)
            }

        }
    }
    console.log(monkeys.map(m => m.inspectCounter))
}

const part2 = (monkeys: Monkey[]) => {
    const reliefValue = product(monkeys.map(m => m.testInt))
    console.log(reliefValue)
    for(let iter = 0; iter < 10000; iter++) {
        for(let [idx, monkey] of monkeys.entries()) {
            for(let item of monkey.getItems()) {
                const newVal = monkey.operate(item)!
                const newMonkey = monkey.testItem(newVal)
                monkeys[newMonkey].items.enqueue(newVal)
                monkeys[newMonkey].P2reduce(reliefValue)
            }
        }
    }
    console.log(monkeys.map(m => m.inspectCounter))
    console.log(getNMax(monkeys.map(m => m.inspectCounter), 2))
    console.log(product(getNMax(monkeys.map(m => m.inspectCounter), 2)))
}

const main = () => {
    const data = fs.readFileSync("input.txt", "utf-8")
        .split("\n\n");
    const monkeys = data.map(monkeyString => createMonkey(monkeyString))
    part2(monkeys)
    
}

main()