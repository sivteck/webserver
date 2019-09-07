const net = require('net')
const toPromise = require('./promisify.js')
const requestHandler = require('./request-handler.js')
const cookieParser = require('./cookie-parser.js')
const urlencodedParser = require('./urlencoded-parser.js')

function serve (port, requestHandler) {
  const server = net.createServer((sock) => {
    console.log('client connected')
    sock.on('data', async (chunk) => { // async iterator
      requestHandler(chunk, sock)
    })
  })
  server.on('error', (err) => {
    console.log(err)
  })
  server.listen(port, () => {
    console.log('server bound')
  })
}

let middlewares = [urlencodedParser, cookieParser]

let routes = {
  '/dummy': [(req, res) => {
    res.send('MEME KILL')
  }, 'GET'],
  '/': [(req, res) => {
    console.log('mea calleeed')
    res.send(JSON.stringify(req))
  }, 'POST']
}

function app () {
  return {
    use: (fn) => { middlewares.push(fn) },
    get: (slug, fn) => { routes[slug] = [fn, 'GET'] },
    post: (slug, fn) => { routes[slug] = [fn, 'POST'] },
    listen: (port, fn) => {
      fn()
      serve(port, requestHandler(middlewares, routes))
    }
  }
}

module.exports = app
