const app = require('./app')

const { HTTP_PORT, HTTP_MAX_CONNECTION_TIME_SECS } = process.env

const server = app.listen(HTTP_PORT, () => {})

process.on('uncaughtException', (err) => {
  shutdownGracefully(err, () => processExit())
})

process.on('unhandledRejection', (err) => {
  shutdownGracefully(err, () => processExit())
})

function shutdownGracefully(err, callback) {
  server.close(() => callback())

  setTimeout(() => {
    callback()
  }, HTTP_MAX_CONNECTION_TIME_SECS).unref()
}

function processExit() {
  process.exit(1)
}
