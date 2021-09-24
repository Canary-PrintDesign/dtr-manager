import Role from '../../src/components/role.js'
import Select from './prompt-select.js'

export default async function promptRole([_, initCommand, ...args]) {
  const roles = await Role.findAll({
    roles: ['crew', 'admin', 'project-admin', 'super-admin'],
  })

  const choices = {}
  for (const role of roles) {
    choices[role.role] = role
  }

  const selectedRole = await Select({
    choices: Object.keys(choices),
    message: 'Select a role',
  })

  return choices[selectedRole]
}
