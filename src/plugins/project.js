const fp = require('fastify-plugin')
const Project = require('../components/project.js')
const httpErrors = require('http-errors')

module.exports = fp(async (fastify) => {
  fastify.addHook('preValidation', async (req, reply) => {
    const hostname = req.hostname.split(':')[0]

    try {
      const project = await Project.findWith({ hostname })
      req.data = { project: project[0] }
    } catch (err) {
      fastify.log.error(err)
      reply.send(httpErrors.Unauthorized())
    }
  })
})
