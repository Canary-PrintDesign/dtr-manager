import promptProject from '../utils/prompt-project.js'
import promptDepartment from '../utils/prompt-department.js'
import promptRole from '../utils/prompt-role.js'
import Token from '../../src/components/auth.js'

export default async function handleCommand(input = ['']) {
  const project = await promptProject(input)
  const department = await promptDepartment(project, input)
  const role = await promptRole(input)

  const token = await Token.createToken({
    project: project.id,
    department: department.id,
    role: role.id,
  })

  console.log(token)
}
