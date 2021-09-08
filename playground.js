#! usr/bin/env node

// ------------------------
// Playground Configuration
// ------------------------

// Hard exit outside of development mode
if (process.env.NODE_ENV !== 'development') process.exit(1)

const logger = require('pino')({ level: 'debug' })
const log = (...args) => logger.debug(...args)
// const { compose, pipe, pipeWith } = require('lib/utils')

// -------------------
// Start Of Playground
// -------------------
//
const Auth = require('./src/components/auth.js')
const Department = require('./src/components/department.js')
const Project = require('./src/components/project.js')
const Agent = require('./src/components/agent.js')
const Role = require('./src/components/role.js')
const RecordNote = require('./src/components/record-note.js')
const TimeRecord = require('./src/components/time-record.js')
const TimeReport = require('./src/components/time-report.js')

async function run() {
  const project = await Project.findWith({ name: 'Test Project' })
  const department = await Department.findAll({ project: project.id })
  const agent = await Agent.findAll({ project: project.id })
  const timeRecord = await TimeRecord.findWith({ project: project.id })
  const recordNote = await RecordNote.findWith({ project: project.id })
  const role = await Role.findWith({ role: 'crew' })
  const timeReport = await TimeReport.findAll({ project: project[0].id })
  console.log(timeReport)
}

// Execute the playground and log results
run()
  .then((results) => log(results, 'results'))
  .catch((err) => log(err, 'error'))
  .finally(() => log('done'))
