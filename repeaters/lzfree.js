import fetch from "node-fetch"

const getAddressPoints = async () => {
    const website = await fetch("https://lz.free.bg")
    const content = await website.text()

    const regex = new RegExp(/(var addressPoints = )(\[.*?\]\n\n)/s)
    const lzVar = content.match(regex)[0].replace("var addressPoints =", "")

    return eval(lzVar)
}

const parse = (addressPoint) => {
    const repeater = {
        name: "",
        rx: "0.000000",
        tx: "0.000000",
        tone: "",
        lat: "",
        lon: "",
        height: ""
    }

    const details = addressPoint[3]

    let name = addressPoint[2]
    const type = details.match(/<b>R\d+<\/b>/)
    if (type !== null) name = type[0].replace(/<\/?b>/g, "") + name.replace("LZ0", "")
    repeater.name = name

    const rx = details.match(/RX: <b>\s?[\d.]+\s?<\/b>/)
    const tx = details.match(/TX: <b>\s?[\d.]+\s?<\/b>/)

    if (rx === null || tx === null) return

    const receive = parseFloat(rx[0].replace(/[^\d.]/g, ""))
    repeater.rx = receive.toFixed(6).toString()

    const transmit = parseFloat(tx[0].replace(/[^\d.]/g, ""))
    repeater.tx = transmit.toFixed(6).toString()

    let tone = details.match(/Тон: <b>\s?[\d.]+\s?<\/b>/)
    if (tone !== null) repeater.tone = tone[0].replace(/[^\d.]/g, "")

    repeater.lon = addressPoint[1]
    repeater.lat = addressPoint[0]
    repeater.height = parseInt(details.match(/(\d+) м/)[0].replace(/[^\d]/g, ""))

    return repeater
}

export const getAll = async () => {
    const repeaters = []
    const addressPoints = await getAddressPoints()

    addressPoints.forEach((addressPoint) => {
        const repeater = parse(addressPoint)

        if (repeater) repeaters.push(repeater)
    })

    return repeaters
}
