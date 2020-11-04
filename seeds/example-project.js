const Project = require('components/project')
const Department = require('components/department')
const Agent = require('components/agent')
const TimeRecord = require('components/time-record')
const RecordNote = require('components/record-note')

const project = Project.create({
  name: 'Test Project',
  logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
  hostname: 'localhost'
})

const departmentA = Department.create({
  name: 'Department A'
})

const departmentB = Department.create({
  name: 'Department B'
})

const departmentC = Department.create({
  name: 'Department C',
  custom: true
})

const agent1 = Agent.create({
  name: 'Agent 1',
  position: 'First Agent'
})

const agent2 = Agent.create({
  name: 'Agent 2',
  position: 'Number Two'
})

const agent3 = Agent.create({
  name: 'Agent 3',
  position: 'Tertiary'
})

const timeRecord1 = TimeRecord.create({
  workStart: '0800',
  lunchStart: '1400',
  lunchStop: '1500',
  workStop: '2100'
})

const timeRecord2 = TimeRecord.create({
  workStart: '0700',
  lunchStart: '1300',
  lunchStop: '1400',
  workStop: '2800'
})

const timeRecord3 = TimeRecord.create({
  workStart: '0400',
  lunchStart: '1300',
  lunchStop: '1400',
  workStop: '3300'
})

const timeRecord4 = TimeRecord.create({
  workStart: '0900',
  lunchStart: '1300',
  lunchStop: '1400',
  workStop: '1700'
})

const recordNote = RecordNote.create({
  note: 'This is a test note',
  date: new Date()
})

exports.seed = function (knex) {
  return Promise.resolve()
    .then(() => Promise.all([
      knex('projects').del(),
      knex('departments').del(),
      knex('agents').del(),
      knex('time_records').del(),
      knex('record_notes').del()
    ]))
    .then(() => projectFactory())
    .then(departmentFactory)
    .then(agentFactory)
    .then(timeRecordFactory)
    .then(recordNoteFactory)
}

async function projectFactory () {
  return await Project.save(await project)
}

async function departmentFactory (project) {
  const projectId = project.id

  const departments = [
    await departmentA,
    await departmentB,
    await departmentC
  ]
    .map(department => ({ ...department, project: projectId }))
    .map(department => Department.save(department))

  return Promise.all(departments)
}

async function agentFactory (departments) {
  const project = departments[0].project

  const agents = [
    await agent1,
    await agent2,
    await agent3
  ]
    .map((agent, i) => ({ ...agent, project, department: departments[`${i}`].id }))
    .map(agent => Agent.save(agent))

  return Promise.all(agents)
}

async function timeRecordFactory (agents) {
  const project = await agents[0].project

  const timeRecords = [
    await timeRecord1,
    await timeRecord2,
    await timeRecord3,
    await timeRecord4
  ]
    .map(async (timeRecord, i) => {
      const agent = await agents[`${i}`] || agents[0]

      return {
        ...timeRecord,
        project,
        department: agent.department,
        agent: agent.id
      }
    })
    .map(async res => TimeRecord.save(await res))

  return Promise.all(timeRecords)
}

async function recordNoteFactory (timeRecords) {
  const { project, department } = await timeRecords[0]
  const note = await recordNote
  return RecordNote.save({ ...note, project, department })
}
