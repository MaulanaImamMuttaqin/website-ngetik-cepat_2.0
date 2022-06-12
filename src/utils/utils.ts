import typingFieldStates from "../components/TypingField/states/typingFieldStates"

export const getStandardDeviation = (array: Array<number>): number => {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

export const calculateTypingSpeed = (char: number, wrong: number) => {
    let gross = char / 5
    let time = typingFieldStates.timer / 60
    let net = Math.round((gross - wrong) / time)
    let accuracy = (((char - wrong) / char) * 100).toFixed(1)
    return [net, accuracy]
}