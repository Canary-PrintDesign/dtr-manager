import promptProject from '../utils/prompt-project.js'
import promptDepartment from '../utils/prompt-department.js'
import promptRole from '../utils/prompt-role.js'
import Token from '../../src/components/auth.js'
import { info, success, error } from '../utils/notice.js'

export default async function handleCommand(input = ['']) {
  const project = await promptProject(input)
  const department = await promptDepartment(project, input)
  const role = await promptRole(input)

  try {
    const token = await Token.createToken({
      project: role.role.includes('super-admin') ? null : project.id,
      department: role.role.includes('admin') ? null : department.id,
      role: role.id,
    })

    success('Success', 'Token created successfully')
    info('Role', token.role)
    info('Token', token.token)
    info('Login URL', `${project.hostname}/login/${token.token}`)
  } catch (err) {
    return error('Error', err.message)
  }
}
