const createError = require('http-errors')
const ParseFormValues = require('../intents/parse-form-values.js')
const CreateDepartment = require('../intents/create-department.js')
const { requireProjectAdmin } = require('../lib/helper-auth.js')

module.exports = async (fastify) => {
  fastify.post('/departments', async (req, reply) => {
    try {
      requireProjectAdmin(req.user)

      const project = req.data.project
      const { name } = ParseFormValues(req.body)
      await CreateDepartment({ project, name })

      reply.redirect('/project-management')
    } catch (err) {
      fastify.log.error(err)
      return createError(400)
    }
  })
}
