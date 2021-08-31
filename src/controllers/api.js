const Agent = require('../components/agent')
const { pipeWith } = require('../lib/utils')

module.exports = {
  requestAgents,
}

async function requestAgents({ project, department }) {
  const agents = await getAgents({
    projectId: project.id,
    departmentId: department,
  })

  return agents
}

// Private

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
