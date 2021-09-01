const fp = require('fastify-plugin')
const fastifyHelmet = require('fastify-helmet')

module.exports = fp(async (fastify) => {
  fastify.register(fastifyHelmet, {
    contentSecurityPolicy: false,
  })
})
