import * as fs from 'fs'

const matrixForm = (arr: any[][]) => {
    console.log("---------")
    arr.forEach(row => console.log(row))
    console.log("---------")
}

const part1 = (startingPosition: string[][], instructionList: number[][]) => {
    for (let [howMany, whereFrom, whereTo] of instructionList) {
        for (let i = 0; i < howMany; i++) {
            if(startingPosition[whereFrom-1].length == 0)
                continue
            startingPosition[whereTo-1].push(startingPosition[whereFrom-1].pop()!)
        }
    }
    console.log(startingPosition.map(v => v[v.length-1]))
}

const part2 = (startingPosition: string[][], instructionList: number[][]) => {
    matrixForm(startingPosition)
    for (let [howMany, whereFrom, whereTo] of instructionList) {
        let temp: string[] = []
        for (let i = 0; i < howMany; i++) {
            if(startingPosition[whereFrom-1].length == 0)
                continue
            temp.push(startingPosition[whereFrom-1].pop()!)
        }
        startingPosition[whereTo-1] = [...startingPosition[whereTo-1], ...temp.reverse()]
    }
    console.log(startingPosition.map(v => v[v.length-1]))
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

function* everyNth<T = void, U = T extends void ? string : T>(arr: U[] | string, step: number, offset: number = 0) {
    for(let n = 0; offset + n < arr.length; n+=step) {
        yield arr[offset+n] as U
    }
}

function zip<T, U>(arr1: T[], arr2: U[]) {
    return arr1.map((_, idx) => (arr1[idx], arr2[idx]))
}

const main = () => {
    const fullDataString = fs.readFileSync("input.txt", "utf-8")

    const [ encodedStorageState, instructions ] = fullDataString.split("\n\n")
    const parsedInstructionList = instructions.split("\n")
        .map(line => [...line.matchAll(/[0-9]+/g)]
        .map(matched => parseInt(matched[0])))
    const encodedStorageStates = encodedStorageState.split("\n")
    const startingPositions = encodedStorageStates.slice(0, -1)
        .map(line => [...everyNth(line, 4, 1)])
    const parsedStartingPosition = transposed(startingPositions.map(line => line).reverse())
    const parsedPositionWithNoEmptySlots = parsedStartingPosition.map(row => row.filter(cell => cell != ' '))
    part2(parsedPositionWithNoEmptySlots, parsedInstructionList)
}

main()