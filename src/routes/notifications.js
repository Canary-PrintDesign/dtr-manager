const Notification = require('../components/project-notification.js')
const createError = require('http-errors')
const { requireProjectAdmin } = require('../lib/helper-auth.js')

module.exports = async (fastify) => {
  fastify.post('/notifications/create', {}, async (req, reply) => {
    try {
      requireProjectAdmin(req.user)

      const project = req.data.project
      const formBody = req.body
      const { type, notification } = handleFormValues(formBody)

      await Notification.save({
        body: notification,
        type,
        project: project.id,
        status: 'published',
      })

      reply.redirect('/project-management')
    } catch (err) {
      fastify.log.error(err)
      throw createError(406)
    }
  })

  fastify.get(
    '/notifications/:notificationId/delete',
    {},
    async (req, reply) => {
      try {
        requireProjectAdmin(req.user)
        const notificationId = req.params.notificationId

        const project = req.data.project
        await Notification.remove({
          notification: notificationId,
          project: project.id,
        })

        reply.redirect('/project-management')
      } catch (err) {
        fastify.log.error(err)
        throw createError(406)
      }
    },
  )
}

function handleFormValues (data) {
  return Object.entries(data)
    .flatMap(([key, value]) => ({ key, value }))
    .reduce((acc, item) => Object.assign(acc, { [item.key]: item.value }), {})
}
