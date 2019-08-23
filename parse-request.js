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

module.exports = parseRequest
