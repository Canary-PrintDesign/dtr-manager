const GetDepartments = require('../intents/get-departments.js')
const { requireProjectAdmin } = require('../lib/helper-auth.js')

module.exports = async (fastify) => {
  fastify.get('/project-management', async (req, reply) => {
    requireProjectAdmin(req.user)

    const project = req.data.project
    const departments = await GetDepartments({ project })

    const notifications = { ...project.notifications }
    delete project.notifications

    return reply.view('project-management', {
      title: 'Project Management',
      user: req.user,
      projectNotifications: null,
      departments,
      project,
      notifications,
    })
  })
}
