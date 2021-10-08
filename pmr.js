const getChannel = (channel, subchannel = 0, tone = '') => {
    let name = `PMR ${channel}`
    let comment = `PMR ${channel}`

    if(subchannel !== 0) name = `${name} - ${subchannel}`
    if(tone !== '') comment = `${comment} - ${tone}`

    const frequency = 445.99375 + (0.0125 * channel - 1)

    return {
        Name: name,
        Frequency:  frequency.toFixed(6).toString(),
        Duplex: '',
        Offset: '0.000000',
        Tone: tone !== '' ? 'Tone' : '',
        rToneFreq: tone !== '' ? tone : '88.5',
        cToneFreq: tone !== '' ? tone : '88.5',
        Mode: 'NFM',
        Comment: comment,
    }
}

const getChannelSubchannels = (channel) => {
    const subchannels = []

    const ctcss = [
        '67.0', '71.9', '74.4', '77.0', '79.7', '82.5', '85.4', '88.5', '91.5', '94.8', '97.4', '100.0', '103.5', '107.2', '110.9', '114.8', '118.8', '123.0', '127.3',
        '131.8', '136.5', '141.3', '146.2', '151.4', '156.7', '162.2', '167.9', '173.8', '179.9', '186.2', '192.8', '203.5', '210.7', '218.1', '225.7', '233.6', '241.8', '250.3',
    ]

    ctcss.forEach((tone, toneIndex) => {
        subchannels.push(getChannel(channel, toneIndex + 1, tone))
    })

    return subchannels
}

const getPMR = (subchannels = false) => {
    let pmr = []

    for(let i = 0; i < 16; i++) {
        const channel = i + 1
        
        pmr.push(getChannel(channel))

        if(subchannels) {
            pmr = [...pmr, getChannelSubchannels(channel)]
        }
    }

    return pmr
}

export default getPMR
