import fetch from 'node-fetch'

const getAddressPoints = async() => {
    const website = await fetch('https://lz.free.bg')
    const content = await website.text()

    const regex = new RegExp(/(var addressPoints = )(\[.*?\]\n\n)/s)
    const lzVar = content.match(regex)[0].replace("var addressPoints =", "")

    return eval(lzVar)
}

const getRepeater = (addressPoint) => {
    const details = addressPoint[3]
    const height = details.match(/(\d+) м/)[0].replace(/[^\d]/g, '')
    const type = details.match(/<b>R\d+<\/b>/)
    const rx = details.match(/RX: <b>\s?[\d.]+\s?<\/b>/)
    const tx = details.match(/TX: <b>\s?[\d.]+\s?<\/b>/)
    const tone = details.match(/Тон: <b>\s?[\d.]+\s?<\/b>/)

    if(rx === null || tx === null) return

    const receive = parseFloat(rx[0].replace(/[^\d.]/g, ''))
    const transmit = parseFloat(tx[0].replace(/[^\d.]/g, ''))
    const toneFreq = tone === null ? '' : tone[0].replace(/[^\d.]/g, "")

    return {
        Name: type === null ? addressPoint[2] : type[0].replace(/<\/?b>/g, ""),
        Frequency: receive.toFixed(6).toString(),
        Duplex: 'split',
        Offset: transmit.toFixed(6).toString(),
        Tone: toneFreq !== '' ? 'TSQL' : '',
        rToneFreq: toneFreq !== '' ? toneFreq : '88.5',
        cToneFreq: toneFreq !== '' ? toneFreq : '88.5',
        Mode: 'FM',
        Comment: addressPoint[4],
        lon: addressPoint[0],
        lat: addressPoint[1],
        height: parseInt(height),
    }
}

export const getRepeaters = async () => {
    const repeaters = []
    const addressPoints = await getAddressPoints()

    addressPoints.forEach((addressPoint) => {
        const repeater = getRepeater(addressPoint)

        if(repeater) repeaters.push(repeater)
    })

    return repeaters
}
