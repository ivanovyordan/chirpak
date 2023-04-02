import * as turf from '@turf/turf'

import * as LZFree from "./lzfree.js"

const getUnique = (repeaters) => {
    const unique = []

    repeaters.forEach((repeater) => {
        if (!unique.some(r => r.rx === repeater.rx)) {
            unique.push(repeater)
        }
    })

    return unique
}

const sortNational = (repeaters) => {
    return repeaters.sort((first, second) => {
        const firstNumber = parseInt(first.name.replace("R", ""))
        const secondNumber = parseInt(second.name.replace("R", ""))

        if (firstNumber < secondNumber) return -1
        if (firstNumber > secondNumber) return 1

        return 0
    })
}

const sortLocal = (repeaters) => {
    return repeaters.sort((first, second) => {
        if (first.distance < second.distance) return -1
        if (first.distance > second.distance) return 1
        return 0
    })
}

const categorise = (repeaters, startingPoint) => {
    const nationalRepeaters = []
    const localRepeaters = []

    for (const repeater of repeaters) {
        const repeaterPoint = turf.point([repeater.lon, repeater.lat])
        repeater.distance = turf.distance(repeaterPoint, startingPoint)

        if (repeater.name.charAt(0) == "R") {
            nationalRepeaters.push(repeater)
        }
        else {
            localRepeaters.push(repeater)
        }
    }

    return {
        nationalRepeaters,
        localRepeaters
    }
}

const getRepeaters = async (coordinates) => {
    const rawRepeaters = await LZFree.getAll()
    const startingPoint = turf.point(coordinates)

    const { nationalRepeaters, localRepeaters } = categorise(rawRepeaters, startingPoint)
    const sortedNationalRepeaters = sortNational(nationalRepeaters, startingPoint)
    const sortedLocalRepeaters = sortLocal(localRepeaters, startingPoint)
    const uniqueNationalRepeaters = getUnique(sortedNationalRepeaters)
    const uniqueLocalRepeaters = getUnique(sortedLocalRepeaters)

    return {
        national: uniqueNationalRepeaters,
        local: uniqueLocalRepeaters
    }
}

export default getRepeaters
