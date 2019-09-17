function parseCookies (cookieString) {
  if (!cookieString) return {} 
  let kvs = cookieString.split(';')
  let kvo = {}
  kvs.forEach(kv => kvo[kv.split('=')[0].trim()] = kv.split('=')[1].trim())
  return kvo
}

function buildCookieString (cookieObj) {
  let cs = ''
  for (k in cookieObj) cs = k + '=' + cookieObj[k] + ';'
  cs.slice(-1)
  return cs
}

module.exports = function (req, res, next) {
  let cookieKV = parseCookies(req.headers['Cookie'])
  req.cookies = cookieKV
  if (!('count' in cookieKV)) {
    let count = Date.now()
    cookieKV['count'] = count.toString()
    res.setHeaders({ 'Set-Cookie' : buildCookieString(cookieKV) })
  }
  next()
}
