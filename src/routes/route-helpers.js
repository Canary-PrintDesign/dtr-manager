const Agent = require('../components/agent.js')
const Department = require('../components/department.js')
const Role = require('../components/role.js')

exports.getDepartmentsForSelect = async (project) => {
  const departments = await Department.findAll({ project })

  return departments.map(({ id, name }) => {
    return { key: id, value: name }
  })
}

exports.getDepartment = async ({ department, project }) =>
  await Department.findWith({ id: department, project })

exports.getAgent = async (id) => await Agent.findWith({ id })

exports.getRolesForSelect = async (allowedRoles) => {
  const roles = await Role.findAll({ roles: allowedRoles })

  return roles.map(({ id, role }) => {
    return { key: id, value: role }
  })
}
