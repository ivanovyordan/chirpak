import * as turf from '@turf/turf'

import * as LZFree from "./lzfree.js"
import * as RepeatersBG from "./repeatersbg.js"

const sortRepeaters = (repeaters, startingPoint) => {
  let mainRepeaters = []
  let secondaryRepeaters = []

  repeaters.forEach((repeater) => {
  if(repeater.Name.match(/R \d|R\d/) !== null) {
    mainRepeaters.push(repeater)
  }
  else {
    secondaryRepeaters.push(repeater)
  }
  })

  mainRepeaters = sortMainRepeaters(mainRepeaters, startingPoint)
  secondaryRepeaters = sortSecondaryRepeaters(secondaryRepeaters, startingPoint)

  return [...getUniqueRepeaters(mainRepeaters), ...getUniqueRepeaters(secondaryRepeaters)]
}

const getUniqueRepeaters = (repeaters) => {
  const unique = []

  repeaters.forEach((repeater) => {
  if(!unique.some(
    r => r.Frequency === repeater.Frequency
    && r.rToneFreq === repeater.rToneFreq
  )) {
    unique.push(repeater)
  }
  })

  return unique
}

const sortMainRepeaters = (repeaters, startingPoint) => {
  return repeaters.sort((first, second) => {
  const firstName = parseInt(first.Name.replace("R", ""))
  const secondName = parseInt(second.Name.replace("R", ""))

  const firstPoint = turf.point([first.lon, first.lat])
  const secondPoint = turf.point([second.lon, second.lat])
  const firstDistance = turf.distance(firstPoint, startingPoint)
  const secondDistance = turf.distance(secondPoint, startingPoint)

  if(firstName < secondName) return -1
  if(firstName > secondName) return 1
  if(firstDistance < secondDistance) return -1
  if(firstDistance > secondDistance) return 1
  return 0
  })
}

const sortSecondaryRepeaters = (repeaters, startingPoint) => {
  return repeaters.sort((first, second) => {
  const firstPoint = turf.point([first.lon, first.lat])
  const secondPoint = turf.point([second.lon, second.lat])
  const firstDistance = turf.distance(firstPoint, startingPoint)
  const secondDistance = turf.distance(secondPoint, startingPoint)

  if(firstDistance < secondDistance) return -1
  if(firstDistance > secondDistance) return 1
  return 0
  })
}


const getRepeaters = async (startingPoint, method = "lzfree") => {
  const repeaters = method === "repeatersbg" ? 
    await RepeatersBG.getRepeaters() :
    await LZFree.getRepeaters()

  return sortRepeaters(repeaters, turf.point(startingPoint))
}

export default getRepeaters
