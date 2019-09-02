const parseRequest = require('./parse-request.js')
const fs = require('fs').promises
const path = require('path')

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

async function getResource (uri) {
  console.log('from getResource')
  console.log(uri)
  let content = ''
  if (uri === '/') content = await fs.readFile('./index.html')
  else content = await fs.readFile('.' + uri)
  return Buffer.from(content)
}

async function buildResponse (reqObj, payload = {}) {
  let res = okRes()
  // res += 'Content-Encoding: gzip\r\n'
  if (reqObj.method === 'POST') return null
  if (reqObj.method === 'GET') {
    try {
      const body = await getResource(reqObj.uri)
      res += 'Content-Length: ' + Buffer.byteLength(body).toString() + '\r\n'
      res += getContentType(reqObj.uri) + '\r\n\r\n'
      res = Buffer.from(res)
      res = Buffer.concat([res, body])
    } catch (e) {
      return null
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

module.exports = async (chunk, socket) => {
    const parsedReq = parseRequest(chunk, socket)
    const responseBuffer = await buildResponse(parsedReq)
    if (responseBuffer === null) return null
    try {
      socket.write(responseBuffer)
    } catch (e) {
      console.log('socket write failed')
      console.log(e)
    }
  }
