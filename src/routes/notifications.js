const httpErrors = require('http-errors')
const Notification = require('../components/project-notification.js')
const createError = require('http-errors')

module.exports = async (fastify) => {
  fastify.post('/notifications/create', {}, async (req, reply) => {
    try {
      if (!req.user.isProjectAdmin) return createError(401)

      const project = req.data.project
      const formBody = req.body
      const { type, notification } = handleFormValues(formBody)

      console.log(notification)

      await Notification.save({
        body: notification,
        type,
        project: project.id,
        status: 'published',
      })

      reply.redirect('/project-management')
    } catch (err) {
      fastify.log.error(err)
      throw httpErrors.NotAcceptable()
    }
  })

  fastify.get(
    '/notifications/:notificationId/delete',
    {},
    async (req, reply) => {
      try {
        if (!req.user.isProjectAdmin) return createError(401)
        const notificationId = req.params.notificationId

        const project = req.data.project
        await Notification.remove({
          notification: notificationId,
          project: project.id,
        })

        reply.redirect('/project-management')
      } catch (err) {
        fastify.log.error(err)
        throw httpErrors.NotAcceptable()
      }
    }
  )
}

function handleFormValues(data) {
  return Object.entries(data)
    .flatMap(([key, value]) => ({ key, value }))
    .reduce((acc, item) => Object.assign(acc, { [item.key]: item.value }), {})
}
