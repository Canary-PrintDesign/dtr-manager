const Agent = require('../components/agent.js')
const TimeRecord = require('../components/time-record.js')
const createError = require('http-errors')

module.exports = async (fastify) => {
  fastify.get('/api/agents', async (req, reply) => {
    if (!req.user.isCrew) return createError(401)

    const agents = await getAgents({
      project: req.data.project,
      department: req.query.department,
    })

    return { agents }
  })
}

async function getAgents({ project, department }) {
  const agents = await TimeRecord.getAgentsInLatestReport({
    project: project.id,
    department,
  })

  return agents.map((agent) => ({
    name: agent.name,
    position: agent.position,
    department: agent.department,
  }))
}
