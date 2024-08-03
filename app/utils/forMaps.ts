import { BallotFrequencies } from "~/types";

export const colorsAndPercentageByFrequencies = (
    regions: string[],
    frequencies: BallotFrequencies[""]
) => {
  let outp = {}
    for (let i = 0; i < frequencies.length; i += 1) {
        const oneDistric = frequencies[i]
        const yes = oneDistric.yes
        const no = oneDistric.no
        const district = oneDistric.val

        const totalAbsolute = yes + no
        const valYes = yes / totalAbsolute

        const r = (238 - (238 * valYes)).toFixed(0);
        const g = (54 + (90 * valYes)).toFixed(0)
        const b = (60 + (195 * valYes)).toFixed(0)

        const indicatorColor = `rgb(${r},${g},${b})`

        outp = {...outp, [district]: {  color: indicatorColor, percentage: Math.round(valYes * 10000) / 100 } }
    }
    return outp
}