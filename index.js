import flags from "./flags.js"
import getRepeaters from "./repeaters/index.js"
import getSimplex from "./simplex.js"
import getPMR from "./pmr.js"
import getSpecial from "./special.js"

let channels = []
let repeaters = []

if (!flags.noNational || !flags.noLocal) {
    repeaters = await getRepeaters(flags.coordinates)
}

if (!flags.noNational) {
    channels = [...channels, ...repeaters.national]
}

if (!flags.noLocal) {
    channels = [...channels, ...repeaters.local]
}

if (!flags.noSimplex) {
    channels = [...channels, ...getSimplex()]
}

if (!flags.noPmr) {
    channels = [...channels, ...getPMR()]
}

if (!flags.noSpecial) {
    channels = [...channels, ...getSpecial()]
}


channels.forEach((channel, index) => {
    channel.Location = (index + 1).toString()
    channel.Name = channel.name
    channel.Frequency = channel.rx

    if (channel.rx === channel.tx) {
        channel.Duplex = ""
        channel.Offset = "0.000000"
    } else if (channel.rx.split("")[0] !== channel.tx.split("")[0]) {
        channel.Duplex = "split"
        channel.Offset = channel.tx
    } else if (channel.rx > channel.tx) {
        channel.Duplex = "-"
        channel.Offset = (channel.rx - channel.tx).toFixed(6).toString()
    } else {
        channel.Duplex = "+"
        channel.Offset = (channel.tx - channel.rx).toFixed(6).toString()
    }

    channel.Tone = channel.tone !== "" ? "Tone" : ""
    channel.rToneFreq = channel.tone !== "" ? channel.tone : "88.5"
    channel.cToneFreq = channel.tone !== "" ? channel.tone : "88.5"

    channel.DtcsCode = "023"
    channel.DtcsPolarity = "NN"
    channel.Mode = "FM"
    channel.TStep = "5.00"
    channel.Skip = ""
    channel.Comment = ""
    channel.MYCALL = ""
    channel.URCALL = ""
    channel.RPT1CALL = ""
    channel.RPT2CALL = ""
    channel.DVCODE = ""
})

const csvString = [
    [
        "Location",
        "Name",
        "Frequency",
        "Duplex",
        "Offset",
        "Tone",
        "rToneFreq",
        "cToneFreq",
        "DtcsCode",
        "DtcsPolarity",
        "Mode",
        "TStep",
        "Skip",
        "Comment",
        "MYCALL",
        "URCALL",
        "RPT1CALL",
        "RPT2CALL",
        "DVCODE",
    ],
    ...channels.map(channel => [
        channel.Location,
        channel.Name,
        channel.Frequency,
        channel.Duplex,
        channel.Offset,
        channel.Tone,
        channel.rToneFreq,
        channel.cToneFreq,
        channel.DtcsCode,
        channel.DtcsPolarity,
        channel.Mode,
        channel.TStep,
        channel.Skip,
        channel.Comment,
        channel.MYCALL,
        channel.URCALL,
        channel.RPT1CALL,
        channel.RPT2CALL,
        channel.DVCODE,
    ])
]
    .map(element => element.join(","))
    .join("\n")

console.log(csvString)