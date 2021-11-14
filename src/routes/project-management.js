const Department = require('../components/department.js')
const createError = require('http-errors')

module.exports = async (fastify) => {
  fastify.get('/project-management', async (req, reply) => {
    if (!req.user.isProjectAdmin) return createError(401)

    const project = req.data.project
    const departments = await Department.findAll({ project: project.id })

    const notifications = { ...project.notifications }
    delete project.notifications

    return reply.view('project-management', {
      title: 'Project Management',
      projectNotifications: null,
      departments,
      project,
      notifications,
      user: req.user,
    })
  })
}
