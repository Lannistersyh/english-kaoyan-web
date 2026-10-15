import test from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'

const pending = () => {
  let resolve, reject
  const promise = new Promise((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
const timers = new Map()
const values = new Map()
let nextTimer = 0, listener, unsubscribed = 0, syncStopped = 0, initial, login
const browser = new EventTarget()
browser.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }
browser.setTimeout = (callback, delay) => { timers.set(++nextTimer, { callback, delay }); return nextTimer }
browser.clearTimeout = id => timers.delete(id)
globalThis.window = browser
globalThis.sessionClient = { auth: {
  getSession: () => initial.promise,
  onAuthStateChange: callback => {
    listener = callback
    return { data: { subscription: { unsubscribe() { unsubscribed++ } } } }
  },
  signInWithPassword: () => login.promise,
  signUp: () => login.promise,
} }
globalThis.stopStartupSync = () => { syncStopped++ }
const hooksSource = `
export const createContext = () => ({ Provider: 'auth-provider' });
export const useContext = () => {};
export const useRef = initial => { const h=globalThis.authHooks,i=h.cursor++; return h.slots[i]??(h.slots[i]={current:initial}); };
export const useState = initial => { const h=globalThis.authHooks,i=h.cursor++; if(!h.slots[i])h.slots[i]={value:initial}; const cell=h.slots[i]; return [cell.value,update=>{cell.value=typeof update==='function'?update(cell.value):update}]; };
export const useEffect = (effect,deps) => { const h=globalThis.authHooks,i=h.cursor++,old=h.slots[i]; if(!old||deps.some((v,n)=>!Object.is(v,old.deps[n]))) {h.slots[i]={deps,cleanup:old?.cleanup};h.effects.push(()=>{h.slots[i].cleanup?.();h.slots[i].cleanup=effect()})} };
`
const result = await build({
  stdin: { contents: "export {AuthProvider} from './src/lib/AuthContext';export * from './src/utils/storage';", resolveDir: process.cwd() },
  bundle: true, platform: 'node', format: 'esm', write: false, logLevel: 'silent', jsx: 'automatic',
  plugins: [{ name: 'startup-fixtures', setup(builder) {
    builder.onResolve({ filter: /^react$/ }, () => ({ path: 'react', namespace: 'boot' }))
    builder.onResolve({ filter: /^react\/jsx-runtime$/ }, () => ({ path: 'jsx', namespace: 'boot' }))
    builder.onResolve({ filter: /^\.\/supabase$/ }, () => ({ path: 'cloud', namespace: 'boot' }))
    builder.onResolve({ filter: /^\.\/sync$/ }, () => ({ path: 'sync', namespace: 'boot' }))
    builder.onLoad({ filter: /.*/, namespace: 'boot' }, ({ path }) => ({ contents: path === 'react' ? hooksSource
      : path === 'jsx' ? 'export const jsx=(type,props)=>({type,props});'
      : path === 'cloud' ? 'export const supabase=globalThis.sessionClient;export const isCloudEnabled=()=>true;'
      : 'export const installAutoSync=()=>globalThis.stopStartupSync;export const pushToCloud=async()=>{};' }))
  } }],
})
const app = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'))
const session = id => ({ user: { id, email: `${id}@example.com` } })
const settle = async () => { await Promise.resolve(); await Promise.resolve() }
function setup() {
  timers.clear(); values.clear(); unsubscribed = 0; syncStopped = 0; initial = pending(); login = pending()
  app.setStorageUser(null)
  const env = { slots: [], cursor: 0, effects: [] }
  const render = () => {
    globalThis.authHooks = env; env.cursor = 0; env.effects = []
    const output = app.AuthProvider({ children: null }).props.value
    for (const effect of env.effects) effect()
    return output
  }
  return { render, cleanup() { for (const slot of env.slots) slot?.cleanup?.() } }
}

test('A stalled auth refresh opens offline after five seconds and ignores late account events', async () => {
  const { render, cleanup } = setup()
  assert.equal(render().loading, true)
  const staleListener = listener
  const timeout = [...timers.values()][0]
  assert.equal(timeout.delay, 5000)
  timeout.callback()
  let auth = render()
  assert.equal(auth.loading, false)
  assert.equal(auth.user, null)
  assert.equal(unsubscribed, 1)
  assert.equal(syncStopped, 1)
  assert.equal(timers.size, 0)
  initial.resolve({ data: { session: session('old-account') } })
  staleListener('SIGNED_IN', session('old-account'))
  await settle(); auth = render()
  assert.equal(auth.user, null)
  assert.equal(app.getStorageUser(), null)
  cleanup()
})

test('Successful startup keeps account storage isolated and cancels its timeout', async () => {
  const { render, cleanup } = setup()
  render()
  initial.resolve({ data: { session: session('alice') }, error: null })
  await settle()
  let auth = render()
  assert.equal(auth.loading, false)
  assert.equal(auth.user.id, 'alice')
  assert.equal(app.getStorageUser(), 'alice')
  assert.equal(timers.size, 0)
  listener('SIGNED_OUT', null)
  auth = render()
  assert.equal(auth.user, null)
  assert.equal(app.getStorageUser(), null)
  cleanup()
})

test('New auth events take precedence over an old initial-session result', async () => {
  const { render, cleanup } = setup()
  render()
  listener('SIGNED_OUT', null)
  initial.resolve({ data: { session: session('stale') }, error: null })
  await settle()
  assert.equal(render().user, null)
  assert.equal(timers.size, 0)
  cleanup()
})

test('Choosing offline cancels an in-flight login; a later explicit login can restore cloud access', async () => {
  const { render, cleanup } = setup()
  let auth = render()
  auth.continueOffline(); auth = render()
  const oldLogin = auth.signIn('old@example.com', 'password')
  auth.continueOffline(); auth = render()
  login.resolve({ data: { session: session('old') }, error: null })
  assert.match((await oldLogin).error, /canceled/)
  assert.equal(render().user, null)
  login = pending()
  const newLogin = render().signIn('alice@example.com', 'password')
  login.resolve({ data: { session: session('alice') }, error: null })
  assert.deepEqual(await newLogin, {})
  initial = pending(); auth = render()
  assert.equal(auth.user.id, 'alice')
  initial.resolve({ data: { session: session('alice') }, error: null })
  await settle(); auth = render()
  assert.equal(app.getStorageUser(), 'alice')
  assert.equal(auth.loading, false)
  assert.equal(timers.size, 0)
  cleanup()
})

test('A rejected startup request opens the offline library without clearing saved study records', async () => {
  const { render, cleanup } = setup()
  values.set('ekw:sessions', 'existing backup')
  render(); initial.reject(new Error('Cloud unavailable')); await settle()
  assert.equal(render().loading, false)
  assert.equal(values.get('ekw:sessions'), 'existing backup')
  assert.equal(timers.size, 0)
  cleanup()
})
