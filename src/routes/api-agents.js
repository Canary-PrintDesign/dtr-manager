const createError = require('http-errors')
const FindAgents = require('../intents/find-all-agents-in-latest-report.js')
const { requireCrew } = require('../lib/helper-auth.js')

module.exports = async (fastify) => {
  fastify.get('/api/agents', async (req) => {
    requireCrew(req.user)

    try {
      const project = req.data.project
      const department = req.query.department
      const agents = await FindAgents({ project, department })

      return { agents }
    } catch (err) {
      fastify.log.error(err)
      return createError(400)
    }
  })
}
