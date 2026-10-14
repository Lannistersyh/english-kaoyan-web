import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {createLocalServer,loadServerEnv} from './http-server.js'
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
loadServerEnv(root)
const server=createLocalServer(path.join(root,'dist'))
server.listen(Number(process.env.PORT || 5173),'127.0.0.1',()=>console.log(`English Study: http://127.0.0.1:${server.address().port}/`))
