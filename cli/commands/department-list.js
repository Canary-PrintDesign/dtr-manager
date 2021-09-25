import Table from 'cli-table3'
import Department from '../../src/components/department.js'

export default async function handleCommand(input = ['']) {
  const departments = await Department.findAll({ project: null })

  const table = new Table({
    head: ['ID', 'Department'],
  })

  for (const { id, name } of departments) {
    table.push([id, name])
  }

  console.log(table.toString())
}
