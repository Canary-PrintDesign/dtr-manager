const fp = require('fastify-plugin')
const fastifyFormbody = require('fastify-formbody')
const qs = require('qs')

module.exports = fp(async (fastify) => {
  fastify.register(fastifyFormbody, {
    parser: (str) => qs.parse(str),
  })
})
