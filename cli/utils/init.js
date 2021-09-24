import { readFile } from 'fs/promises'
import welcome from 'cli-welcome'
import unhandled from 'cli-handle-unhandled'

export default async ({ clear = true }) => {
  const pkg = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url))
  )

  unhandled()
  welcome({
    title: 'dtr',
    tagLine: 'by Gregory Daynes',
    description: pkg.description,
    version: pkg.version,
    bgColor: '#36BB09',
    color: '#000000',
    bold: true,
    clear,
  })
}
