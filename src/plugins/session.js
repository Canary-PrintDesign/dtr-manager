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

  fastify.addHook('preHandler', (request, reply, done) => {
    const user = request.session.get('user') || {
      department: '',
      project: '',
      role: '',
      isCrew: false,
      isAdmin: false,
      isProjectAdmin: false,
    }

    request.user = user

    done()
  })
})
