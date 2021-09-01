const fp = require('fastify-plugin')
const path = require('path')
const fastifyStatic = require('fastify-static')

module.exports = fp(async (fastify) => {
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '..', 'public'),
    prefix: '/assets/',
  })
})
