import http from 'node:http'
import { createServerEntry } from './dist/server/server.js'
import server from './dist/server/server.js'

const handler = createServerEntry({ fetch: server.fetch })

/**
 * Injects a <script type="module" src="..."> tag for the main entry module.
 * TanStack Start's SSR pipeline includes the entry in the manifest (serialized
 * in the streaming barrier) but does not render an actual HTML script tag for it
 * on the server. Without this, the entry module never loads on the client.
 */
function injectEntryScript(html) {
  // Find the modulepreload link for the main entry (index-*.js)
  const match = html.match(/<link rel="modulepreload" href="(\/assets\/index-[^"]+\.js)"/)
  if (!match) {
    console.warn('[start.js] Could not find entry module in HTML')
    return html
  }
  const entryPath = match[1]
  const scriptTag = `<script type="module" src="${entryPath}"></script>`
  // Inject before </head> or after the last script in head
  return html.replace('</head>', scriptTag + '</head>')
}

const httpServer = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  const headers = new Headers()
  for (const [k, v] of Object.entries(req.headers)) {
    if (v) headers.set(k, Array.isArray(v) ? v.join(', ') : v)
  }
  let body = null
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      body = Buffer.concat(chunks)
      handler.fetch(new Request(url, { method: req.method, headers, body }))
        .then((response) => {
          res.writeHead(response.status, Object.fromEntries(response.headers))
          return response.text().then((text) => res.end(injectEntryScript(text)))
        }).catch((err) => {
          console.error(err)
          res.writeHead(500); res.end('Error')
        })
    })
  } else {
    handler.fetch(new Request(url, { method: req.method, headers }))
      .then((response) => {
        res.writeHead(response.status, Object.fromEntries(response.headers))
        return response.text().then((text) => res.end(injectEntryScript(text)))
      }).catch((err) => {
        console.error(err)
        res.writeHead(500); res.end('Error')
      })
  }
})

const PORT = parseInt(process.env.PORT || '3000')
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
