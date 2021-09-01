const fp = require('fastify-plugin')
const path = require('path')
const pointOfView = require('point-of-view')
const pug = require('pug')

module.exports = fp(async (fastify) => {
  fastify.register(pointOfView, {
    engine: {
      pug,
    },
    root: path.join(__dirname, '..', 'views'),
    viewExt: 'pug',
  })
})
