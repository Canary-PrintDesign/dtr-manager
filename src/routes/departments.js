const httpErrors = require('http-errors')
const Department = require('../components/department.js')
const createError = require('http-errors')

module.exports = async (fastify) => {
  fastify.post('/departments/create', {}, async (req, reply) => {
    try {
      if (!req.user.isProjectAdmin) return createError(401)

      const project = req.data.project
      const formBody = req.body
      const { name } = handleFormValues(formBody)
      const custom = true

      await Department.save({ name, custom, project: project.id })

      reply.redirect('/project-management')
    } catch (err) {
      fastify.log.error(err)
      throw httpErrors.NotAcceptable()
    }
  })

  fastify.get('/departments/:departmentId/delete', {}, async (req, reply) => {
    try {
      if (!req.user.isProjectAdmin) return createError(401)

      const project = req.data.project
      await Department.remove({
        department: req.params.departmentId,
        project: project.id,
      })

      reply.redirect('/project-management')
    } catch (err) {
      fastify.log.error(err)
      throw httpErrors.NotAcceptable()
    }
  })
}

function handleFormValues(data) {
  return Object.entries(data)
    .flatMap(([key, value]) => ({ key, value }))
    .reduce((acc, item) => Object.assign(acc, { [item.key]: item.value }), {})
}
