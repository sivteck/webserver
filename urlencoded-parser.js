function parseURLEncodedStr (urlestr) {
  if (!urlestr) return {} 
  let kvs = urlestr.split('&')
  let kvo = {}
  kvs.forEach(kv => kvo[kv.split('=')[0].trim()] = kv.split('=')[1].trim())
  return kvo
}

function extractURLParams (urlestr) {
  if (urlestr.split('?').length !== 2) return null
  return urlestr.split('?')[1]
}

module.exports = function (req, res, next) {
  let urlestr
  if ((req.headers['Content-Type'] === 'application/x-www-form-urlencoded') || (req.urlParams !== '')) {
    urlestr = req.body
    if((req.method === 'GET') && (req.urlParams)) urlestr = req.urlParams
    let parsedObj = parseURLEncodedStr (urlestr)
    if (parsedObj !== {}) req.body = parsedObj
  }
  next()
}
