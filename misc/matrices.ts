const matrixForm = (arr: any[][]) => {
    console.log("---------")
    arr.forEach(row => console.log(row))
    console.log("---------")
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

const createUniformMatrix = <T extends any = number>(n: number, filler: T = 0 as any): T[][] => {
    const rows =  new Array(n)
    for (let i = 0; i < n; i++) {
        rows[i] = new Array(n).fill(filler)
    }
    return rows
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

function madd_int(m1: number[][], m2: number[][]): number[][] {
    return m1.map((row, i) => row.map((_, j) => m1[i][j]+m2[i][j]))
}

function madd_str(m1: string[][], m2: string[][]): string[][] {
    return m1.map((row, i) => row.map((_, j) => m1[i][j]+m2[i][j]))
}

const getMaxValue = (mat: number[][]) => {
    const maxPerRow = mat.map(row => row.reduce((best, next) => best > next ? best : next))
    const max = maxPerRow.reduce((best, next) => best > next ? best : next)
    return max
}