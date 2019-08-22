const fs = require('fs').promises
const net = require('net')
const toPromise = require('./promisify.js')
const path = require('path')

function serve (port, handleRequestFn) {
  const server = net.createServer((sock) => {
    // 'connection' listener
    console.log('client connected')
    sock.on('data', async (chunk) => { // async iterator
      await handleRequestFn(chunk, sock)
    })
  })
  server.on('error', (err) => {
    console.log(err)
  })
  server.listen(port, () => {
    console.log('server bound')
  })
}

function handleRequest (routes) {
  return async (chunk, socket) => {
    const parsedReq = parseRequest(chunk, socket)
    if (parsedReq.uri in routes) {
      const handler = routes[parsedReq.uri]
      let res = {}
      res.send = async (payload) => {
        const responseBuffer = await buildResponse(parsedReq, payload)
        socket.write(responseBuffer)
      }
      handler(parsedReq, res)
    } else {
      const responseBuffer = await buildResponse(parsedReq)
      socket.write(responseBuffer)
    }
  }
}

function getContentType (uri) {
  const contentType = {
    '': 'text/html',
    js: 'application/js',
    json: 'application/json',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    wav: 'audio/x-wav',
    mp4: 'video/mp4',
    webm: 'video/webm'
  }
  return 'Content-Type: ' + contentType[path.extname(uri).slice(1)]
}

async function buildResponse (reqObj, payload = {}) {
  let res = okRes()
  // res += 'Content-Encoding: gzip\r\n'
  if (reqObj.method === 'GET') {
    try {
      const body = await getResource(reqObj.uri)
      res += 'Content-Length: ' + Buffer.byteLength(body).toString() + '\r\n'
      res += getContentType(reqObj.uri) + '\r\n\r\n'
      console.log(res)
      res = Buffer.from(res)
      res = Buffer.concat([res, body])
    } catch (e) {
      if (payload !== {}) {
        res += 'Content-Length: ' + Buffer.byteLength(JSON.stringify(payload)).toString() + '\r\n'
        res += 'Content-Type: ' + 'text/plain\r\n\r\n'
        res = Buffer.from(res)
        res = Buffer.concat([res, Buffer.from(JSON.stringify(payload))])
      } else {
        console.log(e)
        res = notFoundRes()
      }
    }
  }
  return res
}

function notFoundRes () {
  return 'HTTP/1.1 404 Not Found\r\n'
}

function okRes () {
  let res = 'HTTP/1.1 200 OK\r\n'
  res += 'Access-Control-Allow-Origin: *\r\n'
  res += 'Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept\r\n'
  return res
}

function parseRequest (req) {
  console.log(req.toString())
  const reqStr = req.toString().split('\r\n')
  let reqObj = {}
  const reqLine = reqStr[0].split(' ')
  console.log(reqLine)
  if (reqLine[0] === 'GET') {
    reqObj.method = 'GET'
    reqObj.body = ''
  } else if (reqLine[0] === 'POST') reqObj.method = 'POST'
  else return {}
  reqObj.uri = reqLine[1]
  reqObj.protocol = reqLine[2]
  for (let i = 1; i < reqStr.length - 1; i++) {
    const kv = reqStr[i].split(':')
    if (kv.length === 1) {
      reqObj.body = reqStr[i]
      break
    }
    reqObj[kv[0]] = kv[1].trim()
  }
  console.log(reqObj)
  return reqObj
}

async function getResource (uri) {
  let content = ''
  if (uri === '/') content = await fs.readFile('./index.html')
  else content = await fs.readFile('.' + uri)
  return Buffer.from(content)
}

module.exports.serve = serve
module.exports.handleRequest = handleRequest

// async function mainApp () {
//   await serve(80, handleRequest({}))
// }
// 
// mainApp().then(console.log)
