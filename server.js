const fs = require('fs').promises
const net = require('net')
const toPromise = require('./promisify.js')

const server = net.createServer((sock) => {
  // 'connection' listener
  console.log('client connected')
  sock.on('end', () => {
    console.log('client disconnected')
  })
  sock.write('hello\r\n')
  sock.on('data', async function (chunk) {
    let parsedReq = parseRequest(chunk)
    const res = await buildResponse(parsedReq)
    console.log(res)
    sock.write(res)
  })
})
server.on('error', (err) => {
  throw err
})
server.listen(80, () => {
  console.log('server bound')
})

async function buildResponse (reqObj) {
  let res = ''
  if (reqObj.method === 'GET') {
    try {
      res += await getResource(reqObj.uri)
    } catch (e) {
      res = notFoundRes()
    }
  }
  return res
}

function notFoundRes () {
  return ''
}

function parseRequest (req) {
  const reqStr = req.toString().split('\r\n')
  let reqObj = {}
  const reqLine = reqStr[0].split(' ')
  console.log(reqLine)
  if (reqLine[0] === 'GET') reqObj.method = 'GET'
  else return {}
  reqObj.uri = reqLine[1]
  reqObj.protocol = reqLine[2]
  console.log(reqObj)
  return reqObj
}

async function getResource (uri) {
  try {
    let content = ''
    if (uri === '/') content = await fs.readFile('./index.html')
    else content = await fs.readFile('.' + uri)
    return content.toString()
  } catch (e) {
    console.log('Failed to get Resource:', uri)
    throw e
  }
}
