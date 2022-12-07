import * as fs from "fs"

const doesContain = (r1: number[], r2: number[]) => {
    return r1[0] >= r2[0] && r1[1] <= r2[1]
}

class ProperRange {
    start: number
    end: number
    step: number
    size: number
    constructor(start: number, end: number, step: number = 1) {
        this.start = start
        this.end = end
        this.step = step
        this.size = this.isEmpty() ? Math.floor((end - start) / step) : 0
    }
    *[Symbol.iterator]() {
        for (let i = this.start; i <= this.end ; i += this.step) {
            yield i
        }
    }
    doesContainRange (other: ProperRange) {
        return this.start <= other.start && this.end >= other.end
    }
    doesContainNumber(n: number) {
        return this.start <= n && this.end >= n
    }
    isEmpty() {
        return this.start >= this.end
    }
    doesIntersect(other: ProperRange) {
        for (let i of this) {
            if (i >= other.start && i <= other.end) {
                return true
            }
        }
        return false
    }
}

function part1(data: string) {
    const cases = data.split("\n").map(line => line.split(/,/).map(rangeString => rangeString.split("-").map(v => parseInt(v))))
    let sum = 0
    for (let ranges of cases) {
        console.log(ranges)
        if (doesContain(ranges[0], ranges[1]) || doesContain(ranges[1], ranges[0])) {
            console.log(1)
            sum += 1
        }
    }
    console.log(sum)
}

const sum = (data: number[]) => {
    return data.reduce((next, total) => total + next)
}

function part2(data: string) {
    const cases = data.split("\n").map(line => line.split(/,/).map(rangeString => rangeString.split("-").map(v => parseInt(v))))
    const ranges = cases.map(v => v.map(r => new ProperRange(r[0], r[1])))
    const result = sum(ranges.map(([r1, r2]) => r1.doesIntersect(r2) ? 1 : 0))
    console.log(result)

}

const main = () => {
    const data = fs.readFileSync("input.txt", "utf-8")
    part2(data)
}

main()