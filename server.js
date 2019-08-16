const fs = require('fs').promises
const net = require('net')
const toPromise = require('./promisify.js')
const zlib = require('zlib')
const path = require('path')

zlib.gzipPromise = toPromise(zlib.gzip)

const server = net.createServer((sock) => {
  // 'connection' listener
  console.log('client connected')
  sock.on('data', async function (chunk) {
    let parsedReq = parseRequest(chunk)
    const res = await buildResponse(parsedReq)
    sock.write(res)
  })
})
server.on('error', (err) => {
  throw err
})
server.listen(80, () => {
  console.log('server bound')
})

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

async function buildResponse (reqObj) {
  let res = okRes()
  // res += 'Content-Encoding: gzip\r\n'
  if (reqObj.method === 'GET') {
    try {
      const body = await getResource(reqObj.uri)
      res += 'Content-Length: ' + Buffer.byteLength(body).toString() + '\r\n'
      res += getContentType(reqObj.uri) + '\r\n\r\n'
      console.log('body length', Buffer.byteLength(body))
      console.log(res)
      res = Buffer.from(res)
      res = Buffer.concat([res, body])
    } catch (e) {
      console.log(e)
      res = notFoundRes()
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
  if (reqLine[0] === 'GET') reqObj.method = 'GET'
  else if (reqLine[0] === 'POST') reqObj.method = 'POST'
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
