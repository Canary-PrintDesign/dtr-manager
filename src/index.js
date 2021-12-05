const Fastify = require('fastify')
const autoload = require('fastify-autoload')
const Path = require('node:path')

module.exports = async (options) => {
  const fastify = Fastify(options)

  fastify.register(autoload, {
    dir: Path.join(__dirname, 'plugins'),
  })

  fastify.register(autoload, {
    dir: Path.join(__dirname, 'routes'),
  })

  fastify.log.info(`${options.appName} is ready!`)
  return fastify
}
