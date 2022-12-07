import * as fs from 'fs';

const sum = (data: number[]) => {
    return data.reduce((next, total) => total + next)
}

const max = (data: number[]) => {
    return data.reduce((next, maximal) => next > maximal ? next : maximal)
}

const part1 = (data: string) => {
    const elfs = data.split("\n\n").map(elf => elf.split("\n").map(line => parseInt(line)))
    console.log(max(elfs.map(rations => sum(rations))))
}

const popMax = (data: number[]) => {
    const maximal = max(data)
    const maximalIdx = data.indexOf(maximal)
    const newArr = data.filter((_, idx) => idx != maximalIdx)
    return [maximal, newArr] as [number, number[]]
}

const sumNMax = (n: number, data: number[]) => {
    let result = 0
    for (let _ = 0; _ < n; _++) {
        const [value, newData] = popMax(data)
        data = newData
        result += value
    }
    return result
}

const part2 = (data: string) => {
    const elfs = data.split("\n\n").map(elf => elf.split("\n").map(line => parseInt(line)))
    const totals = elfs.map(rations => sum(rations))
    const result = sumNMax(3, totals)
    console.log(result)
}

type comareTo<T> = (newVal: T, oldVal: T) => boolean
class SelectorArray<T> extends Array<T> {
    size: number
    comparator: comareTo<T>

    constructor(size: number, comparator: comareTo<T>) {
        super()
        this.size = size
        this.comparator = comparator
    }

    concat(other: SelectorArray<T>) {
        const new_arr = new SelectorArray(this.size + other.size, this.comparator)
        new_arr.fillFromArray([...this.items(), ...other.items()])
        return new_arr
    }

    items() {
        return this.slice(0)
    }

    push(value: T): number {
        let temp = value;
        for(let i = 0; i < this.length; i++) {
            let thisItem = this[i]
            if(this.comparator(thisItem, value)) {
                temp = thisItem
                this[i] = value
                value = thisItem
            }
        }
        if(this.length < this.size) {
            super.push(temp)
        }
        return this.length
    }
    unshift(...arr: T[]) {
        this.fillFromArray(arr)
        return this.length
    }
    fillFromArray(array: T[]) {
        for (let total of array) {
            this.push(total)
        }
        return this
    }
    
}

const part2Optimal = (data: string) => {
    const elfs = data.split("\n\n").map(elf => elf.split("\n").map(line => parseInt(line)))
    const totals = elfs.map(rations => sum(rations))
    const selector = new SelectorArray<number>(3, (n1, n2) => n1 < n2)
    const result = sum(selector.fillFromArray(totals))
    console.log(result)
}

const main = () => {
    fs.readFile("input.txt", (err, data) => part2Optimal(data.toString()))
}

main()