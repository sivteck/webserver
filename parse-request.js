function parseRequest (req) {
  const reqStr = req.toString().split('\r\n')
  let reqObj = parseStartLine(reqStr[0])
  reqObj.headers = {}
  for (let i = 1; i < reqStr.length - 1; i++) {
    const kv = reqStr[i].split(':')
    if (kv.length === 1) {
      reqObj.body = reqStr[i+1] || null
      break
    }
    reqObj.headers[kv[0]] = kv[1].trim()
  }
  return reqObj
}

function parseStartLine(reqStartLine) {
  let startKV = {}
  let reqLine = reqStartLine.split(' ')
  if (reqLine[0] === 'GET') {
    startKV.method = 'GET'
    if (reqLine[1].startsWith('/?')) parseQueryString(reqLine[1].slice(2))
    startKV.body = ''
  } 
  if (reqLine[0] === 'POST') startKV.method = 'POST'
  startKV.uri = reqLine[1]
  startKV.protocol = reqLine[2]
  return startKV
}

function getHeaders(reqHeaders) {

}

function parseQueryString(kv) {

}

module.exports = parseRequest
