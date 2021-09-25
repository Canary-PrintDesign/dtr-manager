import promptProject from '../utils/prompt-project.js'
import promptDepartment from '../utils/prompt-department.js'
import promptRole from '../utils/prompt-role.js'
import Token from '../../src/components/auth.js'
import Table from 'cli-table3'
import { success, error } from '../utils/notice.js'

export default async function projectTokenCreate(input = ['']) {
  const project = await promptProject(input)
  const department = await promptDepartment(project, input)
  const role = await promptRole(input)

  try {
    const token = await Token.createToken({
      project: role.role.includes('super-admin') ? null : project.id,
      department: role.role.includes('admin') ? null : department.id,
      role: role.id,
    })

    const table = new Table()

    success('Token', 'Created successfully')

    table.push(
      { ID: token.id },
      { Role: token.role },
      { Token: token.token },
      { 'Login URL': `${project.hostname}/login/${token.token}` }
    )

    console.log(table.toString())
  } catch (err) {
    return error('Error', err.message)
  }
}
