const Fastify = require('fastify')

const form = require('./plugins/form.js')
const project = require('./plugins/project.js')
const view = require('./plugins/view.js')
const helmet = require('./plugins/helmet.js')
const publicFiles = require('./plugins/public.js')
const session = require('./plugins/session.js')

const reportRoute = require('./routes/dtr-report.js')
const dtrRoute = require('./routes/dtr.js')
const apiRoute = require('./routes/api-agents.js')
const homeRoute = require('./routes/home.js')

module.exports = async (options) => {
  const fastify = Fastify(options)

  fastify.register(session)
  fastify.register(project)
  fastify.register(helmet)
  fastify.register(form)
  fastify.register(view)
  fastify.register(publicFiles)

  fastify.register(homeRoute)
  fastify.register(apiRoute)
  fastify.register(dtrRoute)
  fastify.register(reportRoute)

  fastify.log.info(`${options.appName} is ready!`)
  return fastify
}
