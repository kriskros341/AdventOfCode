const properModulo = (n: number, m: number) => {
    // Why JS.. Why...
    return ((n % m) + m) % m
}

const moduloWithOffset = (n: number, m: number, offset: number) => {
    return properModulo(n - offset, m) + offset
}

const delta = (n1: number, n2: number) => {
    return Math.abs(n1 - n2)
}

