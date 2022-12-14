export class ProperSet<T> extends Set<T> {
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


// check built in range for similar functionality
export class ProperRange {
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

//  does it even work? like actually?
//  override default behavior of [n] with a new Proxy
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

class Node {
    nodes: Node[] =[]
    parent: Node | undefined
    constructor(parent: Node | undefined) {
        this.parent = parent
    }
    traverseUpToRoot = () => {
        let root: Node = this
        while(root.parent != undefined) {
            root = root.parent
        }
        return root
    }
}