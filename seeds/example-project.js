const Role = require('../src/components/role.js')
const Project = require('../src/components/project.js')
const Department = require('../src/components/department.js')
const Agent = require('../src/components/agent.js')
const TimeRecord = require('../src/components/time-record.js')
const RecordNote = require('../src/components/record-note.js')

exports.seed = function (knex) {
  return Promise.resolve()
    .then(() =>
      Promise.all([
        knex('projects').del(),
        knex('departments').del(),
        knex('agents').del(),
        knex('time_records').del(),
        knex('record_notes').del(),
        knex('roles').del(),
      ])
    )
    .then(() => projectFactory())
    .then(departmentFactory)
    .then(agentFactory)
    .then(timeRecordFactory)
    .then(recordNoteFactory)
    .then(roleFactory)
}

async function projectFactory() {
  const seedProject = await Project.save({
    name: 'Test Project',
    logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    hostname: 'localhost',
    startDate: new Date().toISOString(),
  })

  return seedProject
}

async function departmentFactory(project) {
  const departments = [
    {
      name: 'Department A',
    },
    {
      name: 'Department B',
    },
    {
      project: project.id,
      name: 'Custom Department C',
      custom: true,
    },
  ]

  const newDepartments = []
  for (const department of departments) {
    const newDepartment = await Department.save(department)
    newDepartments.push(newDepartment)
  }

  return newDepartments
}

async function agentFactory(departments) {
  const project = departments[2].project

  const agents = [
    {
      name: 'Agent 1',
      position: 'First Agent',
      project,
      department: departments[0].id,
    },
    {
      name: 'Agent 2',
      position: 'Number Two',
      project,
      department: departments[1].id,
    },
    {
      name: 'Agent 3',
      position: 'Tertiary',
      project,
      department: departments[2].id,
    },
    {
      name: 'Agent 4',
      position: 'Quart',
      project,
      department: departments[0].id,
    },
  ]

  const newAgents = []
  for (const agent of agents) {
    const newAgent = await Agent.save(agent)
    newAgents.push(newAgent)
  }

  return newAgents
}

async function timeRecordFactory(agents) {
  const project = await agents[0].project

  const timeRecords = [
    {
      workStart: '0800',
      lunchStart: '1400',
      lunchStop: '1500',
      workStop: '2100',
      project,
    },
    {
      workStart: '0700',
      lunchStart: '1300',
      lunchStop: '1400',
      workStop: '2800',
      project,
    },
    {
      workStart: '0400',
      lunchStart: '1300',
      lunchStop: '1400',
      workStop: '3300',
      project,
    },
    {
      workStart: '0900',
      lunchStart: '1300',
      lunchStop: '1400',
      workStop: '1700',
      project,
    },
  ]

  const newTimeRecords = []
  for (const [i, timeRecord] of Object.entries(timeRecords)) {
    const newTimeRecord = await TimeRecord.save({
      ...timeRecord,
      department: agents[i].department,
      agent: agents[i].id,
      date: new Date().toISOString().split('T')[0],
    })
    newTimeRecords.push(newTimeRecord)
  }

  return newTimeRecords
}

async function recordNoteFactory(timeRecords) {
  const { project, department } = await timeRecords[0]

  return RecordNote.save({
    note: 'This is a test note',
    date: new Date().toISOString().split('T')[0],
    project,
    department,
  })
}

async function roleFactory(agents) {
  const roles = [
    {
      role: 'crew',
    },
    {
      role: 'admin',
    },
    {
      role: 'project-admin',
    },
    {
      role: 'super-admin',
    },
  ].map((role) => Role.save(role))

  return await Promise.all(roles)
}
