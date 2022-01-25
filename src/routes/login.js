const createError = require('http-errors')
const Auth = require('../components/auth.js')
const GetRole = require('../intents/get-role.js')
const GetDepartment = require('../intents/get-department.js')

module.exports = async (fastify) => {
  fastify.get('/login/:token', async (req, reply) => {
    try {
      const [{ isActive, department, role: Role }] = await Auth.fetch(req.params.token)
      if (!isActive) {
        return createError(403)
      }

      const project = req.data.project
      const [{ id: departmentId }] = await GetDepartment({ department, project })
      const [role, roles] = await GetRole({ id: Role })

      req.session.set('user', {
        department: departmentId,
        project,
        role,
        ...roles,
      })

      reply.redirect('/dtr')
    } catch (err) {
      fastify.log.error(err)
      return createError(404)
    }
  })
}
