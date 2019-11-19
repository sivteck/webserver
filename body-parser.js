module.exports = function (req, res, next) {
  if ((req.headers['Content-Type'] === 'application/json')) req.body = JSON.parse(req.body)
  next()
}
