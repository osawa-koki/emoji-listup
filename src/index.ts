import fs from 'fs'
import * as csv from 'csv'
import { parse } from 'node-html-parser'

const html = fs.readFileSync('./full-emoji-list.html', 'utf8')

const root = parse(html)
const table = root.querySelector('table')

if (table == null) {
  throw new Error('Could not find table.')
}

const csvRows: string[][] = [['no', 'code', 'browser', 'sample', 'gmail', 'sb', 'dcm', 'kddi', 'cldrShortName']]

const rows = table.querySelectorAll('tr')
rows.forEach((row) => {
  const columns = row.querySelectorAll('td')
  if (columns.length !== 9) {
    return
  }

  const no = columns[0].innerText
  const code = columns[1].querySelectorAll('a').map((a) => a.innerText).join(',')
  const browser = columns[2].innerText
  const sample = columns[3].querySelector('img')?.getAttribute('src') ?? columns[3].innerText
  const gmail = columns[4].querySelector('img')?.getAttribute('src') ?? columns[4].innerText
  const sb = columns[5].querySelector('img')?.getAttribute('src') ?? columns[5].innerText
  const dcm = columns[6].querySelector('img')?.getAttribute('src') ?? columns[6].innerText
  const kddi = columns[7].querySelector('img')?.getAttribute('src') ?? columns[7].innerText
  const cldrShortName = columns[8].innerText

  const csvRow: string[] = [no, code, browser, sample, gmail, sb, dcm, kddi, cldrShortName]

  csvRows.push(csvRow)
})

csv.stringify(csvRows, (err, output) => {
  if (err != null) {
    throw err
  }
  fs.writeFileSync('./full-emoji-list.csv', output)
})
