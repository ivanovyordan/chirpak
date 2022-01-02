import fetch from "node-fetch"

const getAddressPoints = async () => {
    const website = await fetch("https://lz.free.bg")
    const content = await website.text()

    const regex = new RegExp(/(var addressPoints = )(\[.*?\]\n\n)/s)
    const lzVar = content.match(regex)[0].replace("var addressPoints =", "")

    return eval(lzVar)
}

const getRepeater = (addressPoint) => {
    const repeater = {
        Name: "",
        Frequency: "0.000000",
        Duplex: "split",
        Offset: "0.000000",
        Tone: "",
        rToneFreq: "88.5",
        cToneFreq: "88.5",
        Mode: "FM",
        Comment: "",
        mix: false,
        lat: "",
        lon: "",
        height: ""
    }

    const details = addressPoint[3]
    const rx = details.match(/RX: <b>\s?[\d.]+\s?<\/b>/)
    const tx = details.match(/TX: <b>\s?[\d.]+\s?<\/b>/)

    if (rx === null || tx === null) return

    let name = addressPoint[2]
    const type = details.match(/<b>R\d+<\/b>/)
    if (type !== null) name = type[0].replace(/<\/?b>/g, "") + name.replace("LZ0", "")
    repeater.Name = name

    const receive = parseFloat(rx[0].replace(/[^\d.]/g, ""))
    repeater.Frequency = receive.toFixed(6).toString()

    const transmit = parseFloat(tx[0].replace(/[^\d.]/g, ""))
    repeater.Offset = transmit.toFixed(6).toString()

    let tone = details.match(/Тон: <b>\s?[\d.]+\s?<\/b>/)
    if (tone !== null) {
        const toneFreq = tone === null ? "" : tone[0].replace(/[^\d.]/g, "")

        repeater.Tone = "Tone"
        repeater.rToneFreq = toneFreq
        repeater.cToneFreq = toneFreq
    }

    repeater.Comment = addressPoint[4]
    repeater.lon = addressPoint[1]
    repeater.lat = addressPoint[0]
    repeater.height = parseInt(details.match(/(\d+) м/)[0].replace(/[^\d]/g, ""))

    return repeater
}

export const getRepeaters = async () => {
    const repeaters = []
    const addressPoints = await getAddressPoints()

    addressPoints.forEach((addressPoint) => {
        const repeater = getRepeater(addressPoint)

        if (repeater) repeaters.push(repeater)
    })

    return repeaters
}
