import Table from 'cli-table3'
import promptProject from '../utils/prompt-project.js'
import Token from '../../src/components/auth.js'

export default async function projectTokenList(input = ['']) {
  const project = await promptProject(input)
  const tokens = await Token.departmentRoleToken({
    project: project.id,
    roles: ['crew', 'admin', 'project-admin'],
  })

  const table = new Table({
    head: ['Department', 'role', 'Login URL'],
  })

  for (const token of tokens) {
    table.push([
      token.departmentName,
      token.role,
      `${project.hostname}/login/${token.token}`,
    ])
  }

  console.log(table.toString())
}
