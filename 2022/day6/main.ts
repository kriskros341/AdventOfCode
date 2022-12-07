import * as fs from 'fs'

const isUnique = (data: string) => {
    return new Set(data).size == data.length
}

function* getSlices(data: string, length: number) {
    for(let n = 0; n < data.length - length + 1; n++) {
        yield data.slice(n, n + length)
    }
}

const part1 = (data: string) => {
    const matchLength = 4
    let iter = matchLength
    for (let match of getSlices(data, matchLength)) {
        if (isUnique(match)) {
            break
        }
        iter++
    }
    console.log(iter)
}

const part2 = (data: string) => {
    const matchLength = 14
    let iter = matchLength
    for (let match of getSlices(data, matchLength)) {
        if (isUnique(match)) {
            break
        }
        iter++
    }
    console.log(iter)
}

const main = () => {
    const data = fs.readFileSync("input.txt", "utf-8")
    part2(data)
}
main()