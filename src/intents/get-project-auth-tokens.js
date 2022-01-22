const Auth = require('../components/auth.js')

module.exports = async function getProjectAuthTokens ({ project, roleList }) {
  project = project.id || project

  return Auth.departmentRoleToken({
    project,
    roles: roleList,
  })
}
