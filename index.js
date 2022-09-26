import * as createCsvWriter from "csv-writer"

import flags from "./flags.js"
import getRepeaters from "./repeaters/index.js"
import getSimplex from "./simplex.js"
import getSpecial from "./special.js"
import getPMR from "./pmr.js"

let channels = []
const repeaters = await getRepeaters(flags.coordinates)

if (!flags.noNational) {
    channels = [...channels, ...repeaters.national]
}

if (!flags.noLocal) {
    channels = [...channels, ...repeaters.local]
}

if (!flags.noSimplex) {
    channels = [...channels, ...getSimplex()]
}

if (!flags.noSpecial) {
    channels = [...channels, ...getSpecial()]
}

if (!flags.noPmr) {
    channels = [...channels, ...getPMR()]
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

const csvWriter = createCsvWriter.createObjectCsvWriter({
    path: "file.csv",
    header: [
        { id: "Location", title: "Location" },
        { id: "Name", title: "Name" },
        { id: "Frequency", title: "Frequency" },
        { id: "Duplex", title: "Duplex" },
        { id: "Offset", title: "Offset" },
        { id: "Tone", title: "Tone" },
        { id: "rToneFreq", title: "rToneFreq" },
        { id: "cToneFreq", title: "cToneFreq" },
        { id: "DtcsCode", title: "DtcsCode" },
        { id: "DtcsPolarity", title: "DtcsPolarity" },
        { id: "Mode", title: "Mode" },
        { id: "TStep", title: "TStep" },
        { id: "Skip", title: "Skip" },
        { id: "Comment", title: "Comment" },
        { id: "MYCALL", title: "MYCALL" },
        { id: "URCALL", title: "URCALL" },
        { id: "RPT1CALL", title: "RPT1CALL" },
        { id: "RPT2CALL", title: "RPT2CALL" },
        { id: "DVCODE", title: "DVCODE" },
    ]
});


await csvWriter.writeRecords(channels)
console.log("DONE")
