const alphabet = "abcdefghijklmnopqrstuvwxyz"
const ALPHABET = alphabet.toUpperCase()

type Side = 'U' | 'D' | 'L' | 'R'
type Vec2 = [number, number]

const sideDirectionTranslation = new Map<Side, Vec2>([
    ['L', [-1, 0]],
    ['R', [1, 0]],
    ['U', [0, 1]],
    ['D', [0, -1]],
])