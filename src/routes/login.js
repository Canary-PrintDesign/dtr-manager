const Auth = require('../components/auth.js')
const Department = require('../components/department.js')
const Role = require('../components/role.js')
const createError = require('http-errors')

module.exports = async (fastify) => {
  fastify.get('/login/:token', async (req, reply) => {
    try {
      const token = await Auth.fetch(req.params.token)
      if (!token.length || !token[0].isActive)
        throw new Error('Token is invalid')

      const department = await Department.findWith({ id: token.department })
      const role = await Role.findWith({ id: token.role })

      req.session.set('auth', {
        department: department[0].id,
        project: department[0].project,
        role: role[0].role,
      })

      reply.redirect('/dtr')
    } catch (err) {
      fastify.log.error(err)
      return createError(404)
    }
  })
}
