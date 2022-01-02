import * as turf from '@turf/turf'

import * as LZFree from "./lzfree.js"
import * as RepeatersBG from "./repeatersbg.js"

const getUniqueRepeaters = (repeaters) => {
    const unique = []

    repeaters.forEach((repeater) => {
        if (!unique.some(
            r => r.Frequency === repeater.Frequency && r.cToneFreq === repeater.cToneFreq
        )) {
            unique.push(repeater)
        }
    })

    return unique
}

const compareRepeaters = (first, second) => {
    if (first.isNational) {
        const firstNumber = parseInt(first.Name.substring(1, first.Name.length - 3))
        const secondNumber = parseInt(second.Name.substring(1, second.Name.length - 3))

        if (firstNumber < secondNumber) return -1
        if (firstNumber > secondNumber) return 1
    }

    if (first.distance < second.distance) return -1
    if (first.distance > second.distance) return 1
    return 0
}

const sortRepeaters = (repeaters, startingPoint) => {
    return repeaters.sort((first, second) => compareRepeaters(first, second))
}

const splitRepeaters = (repeaters, startingPoint) => {
    const nationalRepeaters = []
    const localRepeaters = []

    repeaters.forEach((repeater) => {
        const repeaterPoint = turf.point([repeater.lon, repeater.lat])

        repeater.distance = turf.distance(repeaterPoint, startingPoint)
        repeater.isNational = repeater.Name.match(/^R.*$/)

        if (repeater.Name === "LZ0BSK") {
            repeater.Mode = "NFM"
        }

        if (repeater.isNational) {
            nationalRepeaters.push(repeater)
        }
        else {
            localRepeaters.push(repeater)
        }
    })

    return {
        nationalRepeaters,
        localRepeaters
    }
}

const getRepeaters = async (startingPoint, method = "lzfree") => {
    const rawRepeaters = method === "repeatersbg" ?
        await RepeatersBG.getRepeaters() :
        await LZFree.getRepeaters()

    startingPoint = turf.point(startingPoint)

    const { nationalRepeaters, localRepeaters } = splitRepeaters(rawRepeaters, startingPoint)
    const sortedNationalRepeaters = sortRepeaters(nationalRepeaters, startingPoint)
    const sortedLocalRepeaters = sortRepeaters(localRepeaters, startingPoint)
    const uniqueNationalRepeaters = getUniqueRepeaters(sortedNationalRepeaters)
    const uniqueLocalRepeaters = getUniqueRepeaters(sortedLocalRepeaters)

    return {
        national: uniqueNationalRepeaters,
        local: uniqueLocalRepeaters
    }
}

export default getRepeaters
