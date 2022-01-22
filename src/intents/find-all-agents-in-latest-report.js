const TimeRecord = require('../components/time-record.js')

module.exports = async function findAllAgentsInLatestReport({
  project,
  department,
}) {
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
