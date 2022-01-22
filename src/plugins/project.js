const fp = require('fastify-plugin')
const httpErrors = require('http-errors')
const Project = require('../components/project.js')
const ProjectNotification = require('../components/project-notification.js')

module.exports = fp(async (fastify) => {
  fastify.addHook('preValidation', async (req, reply) => {
    const hostname = req.hostname
      .split(':')[0]
      .replace('.wrap.work', '')
      .replace('.canaryfilm.ca', '')

    try {
      const project = await Project.findWith({ hostname })

      const notifications = await ProjectNotification.findWith({
        project: project[0].id,
      })

      if (!project.length) {
        throw new Error(`Project with hostname ${hostname} not found`)
      }

      req.data = {
        ...req.data,
        project: {
          ...project[0],
          notifications: notifications.map((n) => formatNotificationToFlash(n)),
        },
      }
    } catch (err) {
      fastify.log.error(err)
      reply.send(httpErrors.Unauthorized())
    }
  })
})

function formatNotificationToFlash ({ id, type, body }) {
  body = body.replace(/\n/gm, '<br />')

  return {
    id,
    type,
    msg: body,
  }
}
