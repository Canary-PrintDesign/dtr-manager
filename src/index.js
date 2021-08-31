const path = require('node:path')
const Fastify = require('fastify')
const fastifyStatic = require('fastify-static')
const fastifyHelmet = require('fastify-helmet')
const fastifyFormbody = require('fastify-formbody')
const pointOfView = require('point-of-view')
const pug = require('pug')
const httpErrors = require('http-errors')
const Project = require('./components/project/index.js')
const dtr = require('./controllers/dtr.js')
const Report = require('./controllers/report.js')
const Api = require('./controllers/api.js')

module.exports = async (options) => {
  const fastify = Fastify(options)

  fastify.register(fastifyHelmet, {
    contentSecurityPolicy: false,
  })

  fastify.register(fastifyFormbody)

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/assets/',
  })
  fastify.register(pointOfView, {
    engine: {
      pug,
    },
    root: path.join(__dirname, 'views'),
    viewExt: 'pug',
  })

  // Project lookup
  fastify.addHook('preValidation', async (req, reply) => {
    const hostname = req.hostname.split(':')[0]

    try {
      const project = await Project.findWith({ hostname })
      req.data = { project }
    } catch (err) {
      fastify.log.error(err)
      reply.send(httpErrors.Unauthorized())
    }
  })

  fastify.get('/', async (req, reply) => {
    return reply.view('home', {
      title: 'Welcome',
      project: req.data.project,
    })
  })

  fastify.get('/api/agents', async (req, reply) => {
    const project = req.data.project
    const department = req.query.department
    const agents = await Api.requestAgents({ project, department })

    return { agents }
  })

  fastify.get('/dtr', async (req, reply) => {
    const project = req.data.project
    const departments = await dtr.index({ project })

    return reply.view('time-record', {
      title: 'New Time Sheet',
      departments,
      project,
    })
  })

  fastify.post('/dtr', async (req, reply) => {
    const project = req.data.project
    const formBody = req.body
    const { date, recordNote, department, records } = await dtr.create({
      project,
      formBody,
    })

    return reply.view('time-record-receipt', {
      title: 'Receipt of Time Sheet',
      date,
      recordNote,
      department,
      records,
      project,
    })
  })

  fastify.get('/dtr/report', async (req, reply) => {
    const project = req.data.project
    const { dates, departments, report } = await Report.index({ project })

    return reply.view('report', {
      title: 'Project Report',
      dates,
      departments,
      report,
      project,
    })
  })

  fastify.log.info(`${options.appName} is ready!`)
  return fastify
}
