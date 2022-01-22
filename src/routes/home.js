const template = 'home'
const title = 'Welcome'

module.exports = async (fastify) => {
  fastify.get('/', async (req, reply) => {
    const {
      data: { project },
      user,
    } = req

    return reply.view(template, {
      title,
      project,
      user,
    })
  })
}
