const Agent = require('../components/agent')

module.exports = async (fastify) => {
  fastify.get('/api/agents', async (req, reply) => {
    const project = req.data.project
    const departmentId = req.query.department

    const agents = await getAgents({
      projectId: project.id,
      departmentId,
    })

    return { agents }
  })
}

async function getAgents({ projectId, departmentId }) {
  const agents = await Agent.findAll(projectId, departmentId)

  return Promise.all(agents).then((res) =>
    res.map((agent) => ({
      name: agent.name,
      position: agent.position,
      department: agent.department,
    }))
  )
}
