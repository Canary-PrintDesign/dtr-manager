module.exports = async (fastify) => {
  fastify.get('/', async (req, reply) => {
    return reply.view('home', {
      title: 'Welcome',
      project: req.data.project,
      user: req.user,
    })
  })
}
