module.exports = function (fn) {
  return function (...args) {
    return new Promise(resolve => {
      fn(...args, (err, res) => resolve([err, res]))
    })
  }
}
