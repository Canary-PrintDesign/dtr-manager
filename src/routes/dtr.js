const TimeRecord = require('../components/time-record.js')
const Department = require('../components/department.js')
const { requireCrew } = require('../lib/helper-auth.js')

async function getDepartmentsForSelect (project) {
  const departments = await Department.findAll({ project })

  return departments.map(({ id, name }) => {
    return { key: id, value: name }
  })
}

module.exports = async (fastify) => {
  fastify.get('/dtr', async (req, reply) => {
    requireCrew(req.user)

    const project = req.data.project

    let { department, isCrew, isAdmin, isProjectAdmin } = req.user

    const {
      department: reportDepartment,
      date,
      entries = [],
      notes,
    } = req.session.get('time-report') || {}

    if ((isAdmin || isProjectAdmin) && reportDepartment) {
      department = reportDepartment
    }

    const departments =
      isAdmin || isProjectAdmin ? await getDepartmentsForSelect(project.id) : []

    if (!entries.length) {
      const agents = await TimeRecord.getAgentsInLatestReport({
        project: project.id,
        department,
      })

      if (isCrew && !isAdmin) {
        for (const agent of agents) {
          entries.push({
            name: agent.name,
            position: agent.position,
            department: agent.department,
          })
        }
      }
    }

    return reply.view('time-record', {
      title: 'New Time Sheet',
      departments,
      project,
      user: req.user,
      department,
      date,
      entries,
      notes,
    })
  })
}
