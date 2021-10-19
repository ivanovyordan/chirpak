import * as turf from '@turf/turf'

import * as LZFree from "./lzfree.js"
import * as RepeatersBG from "./repeatersbg.js"

const getUniqueRepeaters = (repeaters) => {
  const unique = []

  repeaters.forEach((repeater) => {
    if(!unique.some(
      r => r.Frequency === repeater.Frequency
    )) {
      unique.push(repeater)
    }
  })

  return unique
}

const sortMainRepeaters = (repeaters) => {
  return repeaters.sort((first, second) => {
    const firstName = parseInt(first.Name.replace("R", ""))
    const secondName = parseInt(second.Name.replace("R", ""))

    if(firstName < secondName) return -1
    if(firstName > secondName) return 1
    if(first.distance < second.distance) return -1
    if(first.distance > second.distance) return 1
    return 0
  })
}

const sortSecondaryRepeaters = (repeaters) => {
  return repeaters.sort((first, second) => {

  const firstPoint = turf.point([first.lon, first.lat])
    if(first.distance < second.distance) return -1
    if(first.distance > second.distance) return 1
    return 0
  })
}


const sortRepeaters = (repeaters, startingPoint) => {
  let mainRepeaters = []
  let secondaryRepeaters = []

  repeaters.forEach((repeater) => {
    const repeaterPoint = turf.point([repeater.lon, repeater.lat])
    repeater.distance = turf.distance(repeaterPoint, startingPoint)

    if(repeater.Name.match(/^R\s?\d+$/)) {
      mainRepeaters.push(repeater)
    }
    else {
      secondaryRepeaters.push(repeater)
    }
  })

  mainRepeaters = sortMainRepeaters(mainRepeaters)
  secondaryRepeaters = sortSecondaryRepeaters(secondaryRepeaters)

  return [...getUniqueRepeaters(mainRepeaters), ...getUniqueRepeaters(secondaryRepeaters)]
}


const getRepeaters = async (startingPoint, method = "lzfree") => {
  const repeaters = method === "repeatersbg" ? 
    await RepeatersBG.getRepeaters() :
    await LZFree.getRepeaters()

  return sortRepeaters(repeaters, turf.point(startingPoint))
}

export default getRepeaters
