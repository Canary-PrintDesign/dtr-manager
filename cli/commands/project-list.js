import Table from 'cli-table3'
import Project from '../../src/components/project.js'

export default async function projectList(input = ['']) {
  const projects = await Project.findAll()

  const table = new Table({
    head: ['ID', 'Name', 'Hostname', 'Status'],
  })

  for (const { id, name, hostname, status } of projects) {
    table.push([id, name, hostname, status])
  }

  console.log(table.toString())
}
