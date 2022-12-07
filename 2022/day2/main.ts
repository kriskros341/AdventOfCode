import * as fs from 'fs'

enum Options {
    Rock = 1,
    Paper = 2,
    Scissors = 3,
    Draw,
    Win,
    Loss
}

const checkResult = (my: Options, other: Options) => {
    if (my == Options.Scissors && other == Options.Rock) {
        return Options.Loss
    }
    if (other == Options.Scissors && my == Options.Rock) {
        return Options.Win
    }
    if (my == other) {
        return Options.Draw
    }
    return my > other ? Options.Win : Options.Loss 
}

const translations: Record<string, Options> = {
    "X": Options.Rock,
    "Y": Options.Paper,
    "Z": Options.Scissors,
    "A": Options.Rock,
    "B": Options.Paper,
    "C": Options.Scissors
}

const bonuses: Record<number, number> = {
    [Options.Draw.valueOf()]: 3,
    [Options.Loss.valueOf()]: 0,
    [Options.Win.valueOf()]: 6
}

function part1(data: string) {
    const parsed = data.split("\r\n").map(line => line.split(" ").map(value => translations[value]))
    let score = 0
    for (let [other, me] of parsed) {
        const res = checkResult(me, other)
        score += me + bonuses[res]
    }
    console.log(score)
}

const translations2: Record<string, Options> = {
    "X": Options.Loss,
    "Y": Options.Draw,
    "Z": Options.Win,
    "A": Options.Rock,
    "B": Options.Paper,
    "C": Options.Scissors
}

const properModulo = (n: number, m: number) => {
    // Why JS.. Why...
    return ((n % m) + m) % m
}


const moduloFrom1 = (n: number, m: number) => {
    return properModulo(n-1, m) + 1
}

function part2(data: string) {
    const parsed = data.split("\r\n").map(line => line.split(" ").map(value => translations2[value]))
    let score = 0;
    for (let [other, outcome] of parsed) {
        let me = -1
        switch(outcome) {
            case Options.Win:
                me = moduloFrom1(other+1, 3)
                break
            case Options.Draw:
                me = other
                break
            case Options.Loss:
                me = moduloFrom1(other-1, 3)
        }
        score += me + bonuses[outcome]
    }
    console.log(score)
}

function main() {
    fs.readFile("input.txt", (err, data) => part2(data.toString()))
}

main()