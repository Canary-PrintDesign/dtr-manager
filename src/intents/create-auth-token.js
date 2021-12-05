const Role = require('../components/role.js')
const Auth = require('../components/auth.js')

module.exports = async function createAuthToken ({
  project,
  department,
  idRole,
  userRole,
}) {
  const [role] = await Role.findWith({ id: idRole })

  if (
    (userRole === 'project-admin' && ['project-admin'].includes(role.role)) ||
    (userRole === 'admin' && ['admin'].includes(role.role))
  ) {
    throw new Error('Cannot create token. Insufficient privileges')
  }

  try {
    return Auth.createToken({
      project,
      department,
      role: idRole,
    })
  } catch (err) {
    throw new Error(err)
  }
}
