const createError = require('http-errors')
const DeleteDepartment = require('../intents/delete-department.js')
const { requireProjectAdmin } = require('../lib/helper-auth.js')

module.exports = async (fastify) => {
  fastify.get('/departments/:id/delete', async (req, reply) => {
    try {
      requireProjectAdmin(req.user)

      const department = req.params.id
      const project = req.data.project

      await DeleteDepartment({ department, project })

      reply.redirect('/project-management')
    } catch (err) {
      fastify.log.error(err)
      return createError(400)
    }
  })
}
