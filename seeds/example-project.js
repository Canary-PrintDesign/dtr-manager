const { store } = require('lib/database')
const Project = require('components/project')
const Department = require('components/department')
const Agent = require('components/agent')
const TimeRecord = require('components/time-record')
const RecordNote = require('components/record-note')

const project = new Project({
  name: 'Test Project',
  logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
  hostname: 'evil.local'
})

const departmentA = new Department({
  name: 'Department A'
})

const departmentB = new Department({
  name: 'Department B'
})

const departmentC = new Department({
  name: 'Department C',
  custom: true
})

const agent1 = new Agent({
  name: 'Agent 1',
  position: 'First Agent'
})

const agent2 = new Agent({
  name: 'Agent 2',
  position: 'Number Two'
})

const agent3 = new Agent({
  name: 'Agent 3',
  position: 'Tertiary'
})

const agent4 = new Agent({
  name: 'Agent 4',
  position: 'Red Shirt'
})

const timeRecord1 = new TimeRecord({
  workStart: '0800',
  lunchStart: '1400',
  lunchStop: '1500',
  workStop: '2100'
})

const timeRecord2 = new TimeRecord({
  workStart: '0700',
  lunchStart: '1300',
  lunchStop: '1400',
  workStop: '2800'
})

const timeRecord3 = new TimeRecord({
  workStart: '0400',
  lunchStart: '1300',
  lunchStop: '1400',
  workStop: '3300'
})

const timeRecord4 = new TimeRecord({
  workStart: '0900',
  lunchStart: '1300',
  lunchStop: '1400',
  workStop: '1700'
})

const recordNote = new RecordNote({
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
    .then(() => store('projects')(project))
    .then(departmentFactory)
    .then(agentFactory)
    .then(timeRecordFactory)
    .then(recordNoteFactory)
}

function departmentFactory (project) {
  const projectId = project.id

  const departments = [departmentA, departmentB, departmentC]
    .map(department => Object.assign(department, { project: projectId }))
    .map(department => department.save())

  return Promise.all(departments)
}

function agentFactory (departments) {
  const project = departments[0].project

  const agents = [
    Object.assign(agent1, { project, department: departments[0].id }),
    Object.assign(agent2, { project, department: departments[1].id }),
    Object.assign(agent3, { project, department: departments[2].id }),
    Object.assign(agent4, { project, department: departments[0].id })
  ]
    .map(agent => agent.save())

  return Promise.all(agents)
}

function timeRecordFactory (agents) {
  const project = agents[0].project

  const timeRecords = [
    Object.assign(timeRecord1, { project, department: agents[0].department, agent: agents[0].id }),
    Object.assign(timeRecord2, { project, department: agents[1].department, agent: agents[1].id }),
    Object.assign(timeRecord3, { project, department: agents[2].department, agent: agents[2].id }),
    Object.assign(timeRecord4, { project, department: agents[3].department, agent: agents[3].id })
  ]
    .map(timeRecord => timeRecord.save())

  return Promise.all(timeRecords)
}

function recordNoteFactory (timeRecords) {
  const { project, department } = timeRecords[0]
  return Object.assign(recordNote, { project, department }).save()
}
