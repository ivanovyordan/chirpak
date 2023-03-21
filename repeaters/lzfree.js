import fetch from "node-fetch"

const getRawRepeaters = async () => {
    const response = await fetch("https://varna.radio/reps.json")
    const text = await response.text()
    const repeaters = JSON.parse(text.trim()).repeaters

    return Object.values(repeaters).filter(repeater => repeater.mode.analog === true || repeater.mode.parrot)
}

const getName = (raw) => {
    const frequency = parseFloat(raw.rx).toFixed(4) * 10000;
    let name = raw.callsign

    if (frequency >= 1452000 && frequency < 1454000 && (frequency - 1452000) % 250 == 0) { // VHF R8-R15
        name = "R" + parseInt(((frequency - 1452000) / 250) + 8)
    } else if (frequency >= 1456000 && frequency < 1460000 && (frequency - 1456000) % 250 == 0) { // VHF R0-R7
        name = "R" + parseInt((frequency - 1456000) / 250)
    }

    return name;
}

const parse = (raw) => {
    const repeater = {
        name: getName(raw),
        rx: raw.rx.toFixed(6),
        tx: raw.tx.toFixed(6),
        tone: raw.tone || "",
        lat: raw.lat,
        lon: raw.lon,
        altitude: raw.altitude
    }

    return repeater
}

export const getAll = async () => {
    const repeaters = []
    const raw = await getRawRepeaters()

    raw.forEach((repeater) => {
        repeaters.push(parse(repeater))
    })

    return repeaters
}
