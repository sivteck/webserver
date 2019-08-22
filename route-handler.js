const server = require('./server.js')

let serve = server.serve
let handleRequest = server.handleRequest



let routes = {
  '/dummy': (req, res) => {
    res.send('MEME KILL')
  }
}

// serve(80, handleRequest(routes))

function app () {
  return {
    get: (slug, fn) => { routes[slug] = fn },
    listen: (port, fn) => {
      fn()
      serve(port, handleRequest(routes))
    }
  }
}

module.exports = app
