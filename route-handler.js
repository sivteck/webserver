const parseRequest = require('./parse-request.js')

function justReturn () {
  return
}

function routeHandler (middlewares, routes) {
  return async (chunk, socket) => {
    const parsedReq = parseRequest(chunk, socket)
    if (parsedReq.uri in routes) {
      const handler = routes[parsedReq.uri][0]
      let res = {}
      res['Transfer-Encoding'] = 'Identity'
      res.send = async (payload) => {
        const responseBuffer = await buildResponse(parsedReq, payload)
        console.log('le uri resp bufferparseddd')
        console.log(responseBuffer)
        socket.write(responseBuffer)
      }

      let pipeLine = [...middlewares, handler]
      for (func of pipeLine) {
        func(parsedReq, res, justReturn)
      }
      // handler(parsedReq, res)
    } else {
      const responseBuffer = await buildResponse(parsedReq)
      try {
        socket.write(responseBuffer)
      } catch (e) {
        console.log('socket write ailed')
        console.log(e)
      }
    }
  }
}

async function buildResponse (reqObj, payload = {}) {
  let res = okRes()
  // res += 'Content-Encoding: gzip\r\n'
  if (reqObj.method === 'GET') {
    if (payload !== {}) {
      res += 'Content-Length: ' + Buffer.byteLength(JSON.stringify(payload)).toString() + '\r\n'
      res += 'Content-Type: ' + 'text/plain\r\n\r\n'
      res = Buffer.from(res)
      res = Buffer.concat([res, Buffer.from(JSON.stringify(payload))])
    } else res = notFoundRes()
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

module.exports = routeHandler
