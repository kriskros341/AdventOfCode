import * as fs from 'fs'
import { stringify } from 'querystring'

const parseForest = (data: string) => {
    return data.split("\n").map(row => row.split('').map(value => parseInt(value)))
}

const createUniformMatrix = <T extends any = number>(n: number, filler: T = 0 as any): T[][] => {
    const rows =  new Array(n)
    for (let i = 0; i < n; i++) {
        rows[i] = new Array(n).fill(filler)
    }
    return rows
}

const transposed = <T>(mat: T[][]) => {
    if (mat.length == 0) {
        return []
    }
    let newMat: T[][] = []
    for (let i = 0; i < mat.length; i++) {
        for (let j = 0; j < mat[i].length; j++) {
            if (newMat[j] == undefined) {
                newMat[j] = []
            }
            newMat[j][i] = mat[i][j]
        }
    }
    return newMat
}

const fillEdges = <T>(matrix: T[][], filler: T) => {
    const n = matrix.length
    let i = 0
    let j = 0
    for (; j < n - 1; j++) {
        matrix[i][j] = filler
    }
    for (; i < n - 1; i++) {
        matrix[i][j] = filler
    }
    for (; j > 0; j--) {
        matrix[i][j] = filler
    }
    for (; i > 0; i--) {
        matrix[i][j] = filler
    }
    return matrix
}

const countValue = <T>(matrix: T[][], value: T) => {
    let count = 0
    matrix.forEach(row => row.forEach(v => count += v == value ? 1 : 0))
    return count
}

const createVisibilityMatrix = (n: number) => {
    const empty = createUniformMatrix(n, false)
    const filler = true
    const edgesVisible = fillEdges(empty, filler)
    return edgesVisible
}

function madd_int(m1: number[][], m2: number[][]): number[][] {
    return m1.map((row, i) => row.map((_, j) => m1[i][j]+m2[i][j]))
}
function madd_str(m1: string[][], m2: string[][]): string[][] {
    return m1.map((row, i) => row.map((_, j) => m1[i][j]+m2[i][j]))
}


const part1 = (data: number[][]) => {
    const visibilityMatrix = createVisibilityMatrix(data.length)
    // from the left
    for (let i = 1; i < data.length-1; i++) {
        let highestSoFar = data[i][0]
        for (let j = 1; j < data.length; j++) {
            const [currentX, currentY] = [i, j]
            const current = data[currentX][currentY]
            if(current > highestSoFar) {
                visibilityMatrix[currentX][currentY] = true
                highestSoFar = current
            }
        }
    }
    // from the right
    for (let i = 1; i < data.length-1; i++) {
        let highestSoFar = data[i][data.length - 1]
        for (let j = 1; j < data.length; j++) {
            const [currentX, currentY] = [i, data.length - j - 1]
            const current = data[currentX][currentY]
            if(current > highestSoFar) {
                visibilityMatrix[currentX][currentY] = true
                highestSoFar = current
            }
        }
    }
    // from the top
    for (let i = 1; i < data.length-1; i++) {
        let highestSoFar = data[0][i]
        for (let j = 1; j < data.length; j++) {
            const [currentX, currentY] = [j, i]
            const current = data[currentX][currentY]
            if(current > highestSoFar) {
                visibilityMatrix[currentX][currentY] = true
                highestSoFar = current
            } 
        }
    }
    // from the bottom
    for (let i = 1; i < data.length-1; i++) {
        let highestSoFar = data[data.length - 1][i]
        for (let j = 1; j < data.length; j++) {
            const [currentX, currentY] = [data.length - j - 1,i]
            const current = data[currentX][currentY]
            if(current > highestSoFar) {
                visibilityMatrix[currentX][currentY] = true
                highestSoFar = current
            }
        }
    }
    console.log(countValue(visibilityMatrix, true))
    const changed2 = data.map(row => row.map(value => value.toString()))
    const changed1 = visibilityMatrix.map(row => row.map(value => value ? "t" : "f"))
    console.log(madd_str(changed1, changed2))
    console.log(countValue(visibilityMatrix, true))
}

type Vec2 = [number, number]

const add_vec2 = (v1: Vec2, v2: Vec2): Vec2 => {
    return v1.map((_, idx) => v1[idx] + v2[idx]) as Vec2
}

const smul_vec2 = (v1: Vec2, val: number) => {
    return v1.map(v => v*val) as Vec2
}

const idxWithin = ([i, j]: Vec2, m: any[][]) => {
    return i >= 0 && j >= 0 && i < m.length && j < m[i].length
}

const getMaxValue = (mat: number[][]) => {
    const maxPerRow = mat.map(row => row.reduce((best, next) => best > next ? best : next))
    const max = maxPerRow.reduce((best, next) => best > next ? best : next)
    return max
}

const part2 = (forest: number[][]) => {
    const forestT = transposed(forest)
    const directions: Vec2[] = [[0, 1], [1, 0], [-1, 0], [0, -1]]
    const treeByVec = (idx: Vec2): number | undefined => {
        return idxWithin(idx, forest) ? forest[idx[0]][idx[1]] : undefined
    }
    const getValueForTree = (treeIdx: Vec2) => {
        let sum = 1
        for (let direction of directions) {
            const v = matchTreesInDirection(treeIdx, direction)
            console.log(v)
            sum *= v
        }
        return sum

    }
    const matchTreesInDirection = (startIndex: [number, number], direction: [number, number]) => {
        let step = 2
        let nextIdx = add_vec2(startIndex, direction)
        let matches = 1
        if(treeByVec(nextIdx) === undefined) {
            return 0
        }
        console.log(direction, treeByVec(nextIdx))
        while(treeByVec(startIndex)! > treeByVec(nextIdx)!) {
            nextIdx = add_vec2(startIndex, smul_vec2(direction, step))
            console.log(direction, treeByVec(nextIdx))
            
            if(treeByVec(nextIdx) === undefined) {
                break
            }
            matches += 1
            step += 1
        }
        return matches
    }
    const values = forest.map((row, i) => row.map((_, j) => getValueForTree([i, j])))
    console.log(getValueForTree([1,1]))
    console.log(getMaxValue(values))
}

const main = () => {
    const file = fs.readFileSync('input.txt', 'utf8')
    const forest = parseForest(file)
    part2(forest)
}


main()