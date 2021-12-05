const createError = require('http-errors')
const ParseFormValues = require('../intents/parse-form-values.js')
const CreateAuthToken = require('../intents/create-auth-token.js')
const { requireProjectAdmin } = require('../lib/helper-auth.js')

module.exports = async (fastify) => {
  fastify.post('/account-management/token', async (req, reply) => {
    requireProjectAdmin(req.user)

    const project = req.data.project.id
    const { department, role: idRole } = ParseFormValues(req.body)
    const userRole = req.user.role

    try {
      await CreateAuthToken({ project, department, idRole, userRole })

      return reply.redirect('/account-management')
    } catch (err) {
      fastify.log.error(err, 'Error creating token')

      return createError(406)
    }
  })
}
