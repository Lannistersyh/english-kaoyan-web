import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createLocalServer, loadServerEnv } from './server/http-server.js'

const root = path.dirname(fileURLToPath(import.meta.url))
loadServerEnv(root)
const port = Number(process.env.PORT || 3003)
const server = createLocalServer()
server.listen(port, '127.0.0.1', () => console.log(`AI proxy: http://127.0.0.1:${server.address().port}`))
