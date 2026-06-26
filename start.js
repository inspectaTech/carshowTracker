import http from 'node:http'
import { createServerEntry } from './dist/server/server.js'
import server from './dist/server/server.js'

const handler = createServerEntry({ fetch: server.fetch })

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
          return response.text().then((text) => res.end(text))
        }).catch((err) => {
          console.error(err)
          res.writeHead(500); res.end('Error')
        })
    })
  } else {
    handler.fetch(new Request(url, { method: req.method, headers }))
      .then((response) => {
        res.writeHead(response.status, Object.fromEntries(response.headers))
        return response.text().then((text) => res.end(text))
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
