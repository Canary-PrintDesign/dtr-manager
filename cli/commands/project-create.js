import Table from 'cli-table3'
import Project from '../../src/components/project.js'
import promptAsk from '../utils/prompt-ask.cjs'
import promptSelect from '../utils/prompt-select.js'
import { success, warn, error } from '../utils/notice.js'

export default async function handleCommand(input = ['']) {
  const name = await promptAsk({
    message: 'Name',
  })

  const hostname = await promptAsk({
    message: 'Hostname',
  })

  const date = await promptAsk({
    message: 'Date (YYYY-MM-DD)',
  })

  const status = await promptSelect({
    choices: ['published', 'unpublished'],
    message: 'Select status',
  })

  const confirm = await promptSelect({
    choices: ['yes', 'cancel'],
    message: 'Create project?',
  })

  if (confirm === 'cancel') return warn('Create', 'Cancelled')

  const startDate = new Date(Date.parse(date))
  if (!isValidDate(startDate)) return error('Date', 'invalid')

  try {
    const project = await Project.save({
      name: `${name}`,
      hostname: `${hostname}`,
      startDate: startDate.toISOString(),
      status,
    })

    const table = new Table()

    success('Project', 'Created successfully')

    table.push(
      { ID: project.id },
      { Name: project.name },
      { Hostname: project.hostname },
      { 'Start Date': project.startDate },
      { Status: project.status }
    )
    console.log(table.toString())
  } catch (err) {
    return error('Error', err.message)
  }
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d)
}
