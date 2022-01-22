const Role = require('../components/role.js')
module.exports = async function getRole ({ id }) {
  const [{ role }] = await Role.findWith({ id })

  const roles = { isCrew: false, isAdmin: false, isProjectAdmin: false }

  /* eslint-disable no-fallthrough */
  switch (role) {
    case 'super-admin':
      roles.isSuperAdmin = true
    case 'project-admin':
      roles.isProjectAdmin = true
    case 'admin':
      roles.isAdmin = true
    case 'crew':
      roles.isCrew = true
  }
  /* eslint-enable no-fallthrough */

  return [role, roles]
}
