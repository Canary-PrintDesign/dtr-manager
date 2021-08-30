const debug = require('../../lib/debug')('http:web:controller:api')
const Agent = require('../../components/agent')
const { pipeWith } = require('../../lib/utils')

module.exports = {
  requestAgents,
}

async function requestAgents(req, res) {
  debug('requestAgents', req.params, req.body, req.query)

  const { project } = req.context
  const agents = await getAgents({
    projectId: project.id,
    departmentId: req.query.department,
  })

  res.data = { agents }
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
