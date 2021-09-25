import Table from 'cli-table3'
import Department from '../../src/components/department.js'
import promptAsk from '../utils/prompt-ask.cjs'
import { success, error } from '../utils/notice.js'

export default async function departmentCreate(input = ['']) {
  const name = await promptAsk({
    message: 'Name',
  })

  try {
    const department = await Department.save({ name })
    const table = new Table()

    success('Department', 'created successfully')
    table.push({ ID: department.id }, { Name: department.name })
    console.log(table.toString())
  } catch (err) {
    return error('Error', err.message)
  }
}
