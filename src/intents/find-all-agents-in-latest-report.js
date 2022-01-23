const TimeRecord = require('../components/time-record.js')

module.exports = async function findAllAgentsInLatestReport ({
  project,
  department,
}) {
  const rawDate = await getLatestReportDate({ project: project.id, department })
  if (!rawDate.length) return
  const [{ date }] = rawDate

  const agents = await getAgentsInReport({
    project: project.id,
    department,
    date,
  })

  return agents
    .filter((agent) => agent._agent)
    .map((agent) => ({
      name: agent._agent.name,
      position: agent._agent.position,
      department: agent._agent.department,
      order: agent.order,
    }))
}

async function getLatestReportDate ({ project, department }) {
  return TimeRecord.query()
    .select('date')
    .where(async (builder) => {
      if (project) builder.where('project', project)
      if (department) builder.where('department', department)
    })
    .orderBy('date', 'desc')
    .limit(1)
}

async function getAgentsInReport ({ project, department, date }) {
  return TimeRecord.query()
    .select('timeRecords.order')
    .distinct(['timeRecords.agent'])
    .withGraphJoined('_agent')
    .where(async (builder) => {
      if (project) builder.where('timeRecords.project', project)
      if (department) builder.where('timeRecords.department', department)
      if (date) builder.where({ date })
    })
}
