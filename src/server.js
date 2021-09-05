#!/usr/bin/env node

const buildServer = require('./index.js')

const { HTTP_HOST, HTTP_PORT, HTTP_MAX_CONNECTION_TIME_SECS } = process.env

const config = {
  appName: 'Test',
  logger: true,
  connectionTimeout: HTTP_MAX_CONNECTION_TIME_SECS,
  ignoreTrailingSlash: true,
}

;(async () => {
  try {
    const fastify = await buildServer(config)

    await fastify.listen(HTTP_PORT, HTTP_HOST)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
