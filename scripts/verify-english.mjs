import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const targets = ['src', 'server', 'api', 'netlify', 'scripts', 'tests/fixtures', 'index.html', 'server.js']
const errors = []
let count = 0
function inspect(relative) {
  const file = path.join(root, relative)
  if (fs.statSync(file).isDirectory()) {
    for (const name of fs.readdirSync(file)) inspect(path.join(relative, name))
    return
  }
  if (!/\.(?:tsx?|jsx?|mjs|css|html|txt|command)$/.test(relative)) return
  count++
  fs.readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (/\p{Script=Han}|[\u2e80-\u2fdf\u31c0-\u31ef\uf900-\ufaff\u{1f200}-\u{1f2ff}]/u.test(line)) errors.push(`${relative}:${i + 1}`)
  })
}
for (const target of targets) inspect(target)
if (errors.length) {
  console.error(`English check failed: ${errors.length} lines contain Chinese characters.\n${errors.join('\n')}`)
  process.exitCode = 1
} else {
  console.log(`English check passed: ${count} source and content files, zero Chinese characters.`)
}
