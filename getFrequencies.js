const https = require('follow-redirects').https
const cheerio = require('cheerio')
const Entities = require('html-entities').AllHtmlEntities

const entities = new Entities()

const get = (url) => new Promise((resolve, reject) => {
  https.get(url, (response) => {
    let body = ''
    response.on('data', (chunk) => body += chunk)
    response.on('end', () => resolve(body))
  }).on('error', reject)
})

const filters = {
  FM: 30000,
  FMN: 15000,
  AM: 75000
}

const dems = {
  FM: 0,
  FMN: 1,
  AM: 2
}

const getData = async (zip) => {
  const data = {}
  const $ = cheerio.load(await get(`https://www.radioreference.com/apps/db/?action=searchZip&from=db&zip=${zip}`))
  $('table.w1p.rrtable').each((i, table) => {
    const $table = $(table)
    const t = $table.parent().prev().prev().text().trim()
    const headers = $('th', $table).map((i, th) => $(th).text().trim())
    const out = []
    $('tr', $table).each((i, tr) => {
      const row = {}
      $('td', tr).map((i, td) => {
        row[headers[i]] = entities.encode($(td).text().trim())
      })
      if (Object.keys(row).length > 0) {
        out.push(row)
      }
    })
    data[t] = out
  })
  delete data['']
  return data
}

const getFrequencies = async (zip) => {
  let id = 0
  const data = await getData(zip)
  return (`<?xml version="1.0" encoding="UTF-8"?>
<sdr_presets version="1">
${Object.keys(data).filter(title => title.trim() !== '').map((title, c) => {
    return `  <category id="${id++}" name="${title}">\n${data[title].map((row, r) => {
        const freq = parseInt(parseFloat(row.Frequency) * 1000000)
        return `    <preset id="${id++}" name="${row.Description.trim()}" freq="${freq}" centfreq="${freq}" offset="0" order="${r + 1}" filter="${filters[row.Mode]}" dem="${dems[row.Mode] || 0}"/>`
      }).join('\n')}\n  </category>`
    }).join('\n')}
</sdr_presets>`)
}

module.exports = {
  getFrequencies,
  getData
}
