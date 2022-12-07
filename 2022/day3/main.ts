import * as fs from 'fs'
let alphabet = "abcdefghijklmnopqrstuvwxyz"
alphabet += alphabet.toUpperCase()

class ProperSet<T> extends Set<T> {
    constructor(...values: T[]) {
        super(values)
    }
    intersection(otherSet: Set<T>) {
        return new ProperSet(...[...this].filter(v => otherSet.has(v)))
    }
    union(otherSet: Set<T>) {
        return new ProperSet(...this, ...otherSet)
    }
}

const getPrio = (char: string) => {
    return alphabet.indexOf(char[0]) + 1
}

const part1 = (input: string) => {
    const lines = input.split("\n")
    const parts = lines.map(line => [new ProperSet(...line.slice(0, line.length/2)), new ProperSet(...line.slice(line.length/2))])
    const intersections = parts.map(([s1, s2]) => [...s1.intersection(s2)])
    const results = intersections.flat().map(v => getPrio(v))
    const result = results.reduce((total, nextVal) => total += nextVal)
}

function* intoGroupsOf<T>(input: T[], perGroupCount: number) {
    let i = 0
    for (; i + perGroupCount < input.length; i += perGroupCount) {
        yield input.slice(i, i + perGroupCount)
    }
    yield input.slice(i)
}

const part2 = (input: string) => {
    const lines= input.split("\n")
    const groups = intoGroupsOf(lines, 3)
    let sum = 0
    for (let group of groups) {
        const sets = group.map(v => new ProperSet(...v))
        const common = sets.reduce((t, n) => n.intersection(t))
        console.log(common)
        sum += 1
    }
    console.log("gg", sum)
}

const main = () => {
    console.log("jd")
    const data = fs.readFileSync("input3.txt", "utf-8")
    part2(data)
}

main()