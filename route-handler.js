const server = require('./server.js')

let serve = server.serve
let handleRequest = server.handleRequest

function routesOO () {
  return {
    routes: {},
    get (slug, fn, method = 'GET') {
      this.routes[slug] = fn
      this.routes[slug].method = method
    },
    send () {
    },
    listen (port) {
    }
  }
}

let routes = {
  '/dummy': (req, res) => {
    res.send('MEME KILL')
  }
}

serve(80, handleRequest(routes))
