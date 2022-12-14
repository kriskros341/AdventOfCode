import * as fs from 'fs'

class DefaultMap<T> extends Map<any, T> {
    default: T
    constructor(def: T) {
        super()
        this.default = def
    }
    getVal(indice: any) {
        if (!super.get(indice)) {
            super.set(indice, this.default)
        }
        return super.get(indice)
    }
}

class File {
    name: string
    size: number
    constructor(FIL: string, SIZE: number) {
        this.name = FIL
        this.size = SIZE
    } 
}

class Directory {
    contents: File[] = []
    subDirectories: Directory[] =[]
    name: string
    parent: Directory
    value: number;
    constructor(name: string, parent?: Directory) {
        this.name = name
        this.parent = parent || this
        this.value = 0
    }
}


const traverseUpToRoot = (graph: Directory) => {
    let root = graph;
    while(root.name != "/") {
        root = root.parent
    }
    return root
}

const fillInValues = (dir: Directory) => {
    for (let subDir of dir.subDirectories) {
        dir.value += fillInValues(subDir)
    }
    const fileSizes = dir.contents
        .map(v => v.size)
    if(fileSizes.length > 0) {
        dir.value += fileSizes.reduce((total, next) => total + next)
    }
    return dir.value
}

const listDirectories = (dir: Directory) => {
    const matches: Directory[] = []
    const helper = (dir: Directory) => {
        for (let subDir of dir.subDirectories) {
            helper(subDir)
        }
        matches.push(dir)
    }
    helper(dir)
    return matches
}

const part1 = (commands: string[]) => {
    let graph = new Directory("/")
    for (let command of commands.slice(1)) {
        const line = command.split(" ")
        if(line[0] == "$") {
            if(line[1] == "cd") {
                if(line[2] == "..") {
                    graph = graph.parent
                }
                else {
                    const target = graph.subDirectories.find(v => v.name == line[2])
                    if(target){
                        graph = target
                    } 
                }
            }
        }
        else if(line[0] == "dir") {
            graph.subDirectories.push(new Directory(line[1], graph))
        } else {
            graph.contents.push(new File(line[1], parseInt(line[0])))
        }
    }
    const root = traverseUpToRoot(graph)
    fillInValues(root)
    const directories = listDirectories(root)
    const matches = directories.filter(dir => dir.value <= 100000)
    const sum = matches
        .map(dir => dir.value)
        .reduce((total, next) => total + next)
    console.log(sum)
}

const getTotalFSSize = (root: Directory) => {
    let totalFileSizes = 0
    const helper = (root: Directory) => {
        for(let dir of root.subDirectories) {
            helper(dir)
        }
        for(let file of root.contents) {
            totalFileSizes += file.size   
        }
    }
    helper(root)
    return totalFileSizes
}

const part2 = (commands: string[]) => {
    let graph = new Directory("/")
    for (let command of commands.slice(1)) {
        const line = command.split(" ")
        if(line[0] == "$") {
            if(line[1] == "cd") {
                if(line[2] == "..") {
                    graph = graph.parent
                }
                else {
                    const target = graph.subDirectories.find(v => v.name == line[2])
                    if(target){
                        graph = target
                    } 
                }
            }
        }
        else if(line[0] == "dir") {
            graph.subDirectories.push(new Directory(line[1], graph))
        } else {
            graph.contents.push(new File(line[1], parseInt(line[0])))
        }
    }
    const root = traverseUpToRoot(graph)
    fillInValues(root)
    const directories = listDirectories(root)
    const total = getTotalFSSize(root)
    const max = 70000000
    const required = 30000000
    const free = max - total
    const needed = required - free
    const matching = directories.filter(dir => dir.value > needed)
    const result = matching.reduce((t, n) => t.value < n.value ? t : n)
    console.log(result.value)
}

const main = () => {
    const data = fs.readFileSync("input.txt", "utf-8").split("\r\n")
    console.log(data)
    part2(data)
}
main()