const sum = (data: number[]) => {
    return data.reduce((next, total) => total + next)
}

const max = (data: number[]) => {
    return data.reduce((next, maximal) => next > maximal ? next : maximal)
}

const popMax = (data: number[]) => {
    const maximal = max(data)
    const maximalIdx = data.indexOf(maximal)
    const newArr = data.filter((_, idx) => idx != maximalIdx)
    return [maximal, newArr] as [number, number[]]
}

//would be better to sort the array, cut and then sum
const sumNMax = (n: number, data: number[]) => {
    let result = 0
    for (let _ = 0; _ < n; _++) {
        const [value, newData] = popMax(data)
        data = newData
        result += value
    }
    return result
}

function* intoGroupsOf<T>(input: T[], perGroupCount: number) {
    let i = 0
    for (; i + perGroupCount < input.length; i += perGroupCount) {
        yield input.slice(i, i + perGroupCount)
    }
    yield input.slice(i)
}

function* everyNth<T = void, U = T extends void ? string : T>(arr: U[] | string, step: number, offset: number = 0) {
    for(let n = 0; offset + n < arr.length; n+=step) {
        yield arr[offset+n] as U
    }
}

function zip<T, U>(arr1: T[], arr2: U[]) {
    return arr1.map((_, idx) => (arr1[idx], arr2[idx]))
}

const isUnique = (data: string) => {
    return new Set(data).size == data.length
}

function* getSlices(data: string, length: number) {
    for(let n = 0; n < data.length - length + 1; n++) {
        yield data.slice(n, n + length)
    }
}

type Vec2 = [number, number]

const add_vec2 = (v1: Vec2, v2: Vec2): Vec2 => {
    return v1.map((_, idx) => v1[idx] + v2[idx]) as Vec2
}

const smul_vec2 = (v1: Vec2, val: number) => {
    return v1.map(v => v*val) as Vec2
}

const sub_vec2 = (v1: Vec2, v2: Vec2) => {
    return v1.map((_, idx) => v1[idx] - v2[idx]) as Vec2
}

const distance = (v1: Vec2, v2: Vec2) => {
    return Math.sqrt((v1[0]-v2[0])*(v1[0]-v2[0]) + (v1[1]-v2[1])*(v1[1]-v2[1]))
}