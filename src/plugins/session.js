const fp = require('fastify-plugin')
const fs = require('fs')
const path = require('path')

module.exports = fp(async (fastify) => {
  fastify.register(require('fastify-secure-session'), {
    key: fs.readFileSync(path.join(__dirname, '..', '..', 'secret-key')),
    cookie: {
      path: '/',
    },
  })
})
