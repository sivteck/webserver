const routeHandler = require('./route-handler.js')
const staticHandler = require('./static-handler.js')

function requestHandler (routes) {
  return async (chunk, socket) => {
    console.log(routes)
    let res = await staticHandler()(chunk, socket)
    if (res === null) res = await routeHandler(routes)(chunk, socket)
  }
}

module.exports = requestHandler
