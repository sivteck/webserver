const routeHandler = require('./route-handler.js')
const staticHandler = require('./static-handler.js')

function requestHandler (middlewares, routes) {
  return async (chunk, socket) => {
    let res = await staticHandler(chunk, socket)
    if (res === null) res = await routeHandler(middlewares, routes)(chunk, socket)
  }
}

module.exports = requestHandler
