const app = require('./app')
const debug = require('./lib/debug')('http:server')

const { HTTP_PORT, HTTP_MAX_CONNECTION_TIME_SECS } = process.env

const server = app.listen(HTTP_PORT, () => {
  debug(`App started on port ${HTTP_PORT}`)
})

process.on('uncaughtException', (err) => {
  shutdownGracefully(err, () => processExit())
})

process.on('unhandledRejection', (err) => {
  shutdownGracefully(err, () => processExit())
})

function shutdownGracefully(err, callback) {
  debug('error', err, err.stack)

  debug('Shutting down gracefully, waiting for connections to close')
  server.close(() => callback())

  setTimeout(() => {
    debug('Connections not closed in time, forced shutdown')
    callback()
  }, HTTP_MAX_CONNECTION_TIME_SECS).unref()
}

function processExit() {
  debug('Process exiting')
  process.exit(1)
}
