module.exports = function getUserRoles ({ userRole }) {
  const roles = []

  switch (userRole) {
    case 'super-admin':
      roles.push('project-admin')
    case 'project-admin':
      roles.push('admin')
    case 'admin':
      roles.push('crew')
  }

  return roles
}
