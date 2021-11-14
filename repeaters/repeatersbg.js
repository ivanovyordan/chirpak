import fetch from "node-fetch"
import * as cheerio from "cheerio"

const loadURL = async (url) => {
  const result = await fetch(url)
  const content = await result.text()

  return cheerio.load(content)
}

const getRepeater = async (id) => {
  const url = `http://www.repeaters.bg/repeater/view/id/${id}`
  const $ = await loadURL(url)
  const rows = $("table > tbody tr")

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
    lat: "",
    lon: "",
    height: ""
  }

  rows.each((_, row) => {
    const key = $(row).find("th").text()
    const value = $(row).find("td").text()
    let mix = false

    if(key === "Callsign") {
      repeater.Name = value
    }

    if(key === "Channel" && value.match(/^R\s?\d+$/)) {
      repeater.Name = value
    }

    if(key === "Channel" && value.includes("Mix")) {
      mix = true
    }

    if(key === "Output") {
      repeater.Frequency = parseFloat(value).toFixed(6).toString()
    }

    if(key === "Input") {
      repeater.Offset = parseFloat(value).toFixed(6).toString()
    }

    if(key === "Tone" && value !== "0" && value !== "-") {
      const tone = value.replace(",", ".").replace(/rx- (\d+.\d+).*/, "$1")

      repeater.Tone = mix ? "TSQL" : "Tone"
      repeater.rToneFreq = tone
      repeater.cToneFreq = tone
    }

    if(key === "Location") {
      repeater.Comment = value
    }

    if(key === "Latitude") {
      repeater.lat = value
    }

    if(key === "Longitude") {
      repeater.lon = value
    }

    if(key === "Above Sea Level") {
      repeater.height = value
    }
  })

  return repeater
}

const getPage = async (page) => {
  const url = `http://www.repeaters.bg/repeater/index?Repeater%5Bmode%5D=analog&Repeater%5Bstatus%5D=1&Repeater_sort=band&Repeater_page=${page}&ajax=repeater-grid`
  return await loadURL(url)
}

const getPageRepeaters = async ($) => {
  const repeaters = []
  const ids = []

  $(".keys span").each((_, element) => {
    ids.push($(element).text())
  })

  for(let index = 0; index < ids.length; index++) {
    repeaters.push(await getRepeater(ids[index]))
  }

  return repeaters
}

export const getRepeaters = async () => {
  let repeaters = []
  let page = 1
  let hasNextPage = true

  while(hasNextPage) {
    console.log(`Parsing page # ${page}`)

    const $ = await getPage(page)
    const pageRepeaters = await getPageRepeaters($)

    repeaters = [...repeaters, ...pageRepeaters]

    ++page
    if($(".pager .btn:not(.hidden):last").hasClass("selected")) {
      hasNextPage = false
    }
  }

  return repeaters
}
