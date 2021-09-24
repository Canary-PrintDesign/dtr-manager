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

      const department = await Department.findWith({ id: token[0].department })
      const role = await Role.findWith({ id: token[0].role })

      const roles = { isCrew: false, isAdmin: false, isProjectAdmin: false }

      switch (role[0].role) {
        case 'super-admin':
          roles.isSuperAdmin = true
        case 'project-admin':
          roles.isProjectAdmin = true
        case 'admin':
          roles.isAdmin = true
        case 'crew':
          roles.isCrew = true
      }

      req.session.set('user', {
        department: department[0].id,
        project: department[0].project,
        role: role[0].role,
        ...roles,
      })

      reply.redirect('/dtr')
    } catch (err) {
      fastify.log.error(err)
      return createError(404)
    }
  })
}
