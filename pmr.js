const getChannel = (channel) => {
    const frequency = 445.99375 + (0.0125 * channel)

    return {
        name: `PMR ${channel}`,
        rx: frequency.toFixed(6).toString(),
        tx: frequency.toFixed(6).toString(),
        tone: "",
    }
}

const getPMR = (subchannels = false) => {
    let pmr = []

    for (let i = 0; i < 16; i++) {
        const channel = i + 1

        pmr.push(getChannel(channel))
    }

    return pmr
}

export default getPMR
