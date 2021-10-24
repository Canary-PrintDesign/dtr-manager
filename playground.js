#! usr/bin/env node

// ------------------------
// Playground Configuration
// ------------------------

// Hard exit outside of development mode
if (process.env.NODE_ENV !== 'development') process.exit(1)

const logger = require('pino')({ level: 'debug' })
const log = (...args) => logger.debug(...args)
const Path = require('path')
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
  let department = '0a0ef5aa-d6e0-4778-91a8-32244ccb1ac4'

  const results = await TimeRecord.getAgentsInLatestReport({ department })

  console.log(results)
}

// Execute the playground and log results
run()
  .then((results) => log(results, 'results'))
  .catch((err) => log(err, 'error'))
  .finally(() => log('done'))
