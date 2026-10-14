import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {spawn,spawnSync} from 'node:child_process'
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
process.chdir(root)
async function health(port){try{const r=await fetch(`http://127.0.0.1:${port}/__health`,{signal:AbortSignal.timeout(800)});return r.ok&&(await r.json()).app==='english-study'}catch{return false}}
let port
for(let candidate=5173;candidate<=5180;candidate++)if(await health(candidate)){port=candidate;break}
if(port){console.log(`English Study is already running: http://127.0.0.1:${port}/`);if(!process.argv.includes('--no-open'))spawnSync('/usr/bin/open',[`http://127.0.0.1:${port}/`]);process.exit(0)}
if(!fs.existsSync('node_modules/typescript/bin/tsc')){console.error('Dependencies are missing. Run npm ci in the project folder.');process.exit(1)}
console.log('Preparing English Study...')
for(const args of [['scripts/verify-english.mjs'],['node_modules/typescript/bin/tsc','-b'],['node_modules/vite/bin/vite.js','build']]){const result=spawnSync(process.execPath,args,{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1)}
let child
for(let candidate=5173;candidate<=5180;candidate++){
 child=spawn(process.execPath,['server/local.mjs'],{env:{...process.env,PORT:String(candidate)},stdio:'inherit'})
 let exited=false;child.once('exit',()=>{exited=true})
 for(let i=0;i<30&&!exited;i++){if(await health(candidate)){port=candidate;break}await new Promise(r=>setTimeout(r,150))}
 if(port)break
 if(!exited)child.kill('SIGTERM')
}
if(!port){console.error('Could not start the site on ports 5173-5180.');process.exit(1)}
console.log(`Ready: http://127.0.0.1:${port}/\nKeep this terminal open. Press Control-C to stop.`)
if(!process.argv.includes('--no-open'))spawnSync('/usr/bin/open',[`http://127.0.0.1:${port}/`])
for(const signal of ['SIGINT','SIGTERM','SIGHUP'])process.on(signal,()=>{child.kill('SIGTERM');process.exit(0)})
child.once('exit',code=>process.exit(code||0))
