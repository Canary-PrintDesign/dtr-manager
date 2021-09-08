const Agent = require('../components/agent.js')

module.exports = async (fastify) => {
  fastify.get('/api/agents', async (req, reply) => {
    const agents = await getAgents({
      project: req.data.project,
      department: req.query.department,
    })

    return { agents }
  })
}

async function getAgents({ project, department }) {
  const agents = await Agent.findAll({ project: project.id, department })

  return agents.map((agent) => ({
    name: agent.name,
    position: agent.position,
    department: agent.department,
  }))
}
