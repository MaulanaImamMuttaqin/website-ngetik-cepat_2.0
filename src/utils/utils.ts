
export const getStandardDeviation = (array: Array<number>, max?: number | null): number => {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    const result = Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
    if (max) {
        if (result > max) {
            return max
        }
    }
    return result
}

export const calculateTypingSpeed = (char: number, wrong: number, duration: number) => {
    let gross = char / 5
    let time = duration / 60
    let net = Math.round((gross - wrong) / time)
    let accuracy = (((char - wrong) / char) * 100).toFixed(1)
    return [net, accuracy]
}

export const uuid = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const calculateRyhtm = (rythm: number[]) => {
    let r: number[] = []
    for (let i = 0; i < rythm.length; i++) {
        if (rythm[i + 1]) {
            r.push(rythm[i + 1] - rythm[i])
        }
    }
    return r
}

export const getTimeNow = (digits: number = 1000) => Math.round(Date.now() / digits)
// export const checkStrExist = (str:string, pattern) =>{
//     return str.test()
// } 