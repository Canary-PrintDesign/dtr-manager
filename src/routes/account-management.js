const Auth = require('../components/auth.js')
const Role = require('../components/role.js')
const {
  getDepartmentsForSelect,
  getRolesForSelect,
} = require('./route-helpers')
const createError = require('http-errors')

module.exports = async (fastify) => {
  fastify.get('/account-management', async (req, reply) => {
    if (!req.user.isAdmin) return createError(401)

    const roles = []
    switch (req.user.role) {
      case 'super-admin':
        roles.push('project-admin')
      case 'project-admin':
        roles.push('admin')
      case 'admin':
        roles.push('crew')
    }

    const project = req.data.project
    const tokens = await Auth.departmentRoleToken({
      project: project.id,
      roles,
    })

    return reply.view('account-management', {
      title: 'Account Management',
      project,
      tokens: groupColumns(tokens),
      departments: await getDepartmentsForSelect(project.id),
      roles: await getRolesForSelect(roles),
      baseLoginUrl: `${req.hostname}/login/`,
      user: req.user,
    })
  })

  fastify.post('/account-management/token', async (req, reply) => {
    if (!req.user.isAdmin) return createError(401)

    const project = req.data.project.id
    const { department, role: roleId } = handleFormValues(req.body)
    const role = await Role.findWith({ id: roleId })

    if (
      req.user.role === 'project-admin' &&
      ['project-admin'].includes(role[0].role)
    ) {
      return createError(406)
    } else if (req.user.role === 'admin' && ['admin'].includes(role[0].role)) {
      return createError(406)
    }

    await Auth.createToken({
      project,
      department,
      role: role[0].id,
    })

    return reply.redirect('/account-management')
  })
}

function handleFormValues(data) {
  return Object.entries(data)
    .flatMap(([key, value]) => ({ key, value }))
    .reduce((acc, item) => Object.assign(acc, { [item.key]: item.value }), {})
}

function groupColumns(tokens) {
  const results = []
  const departments = []
  const roles = []

  for (const token of tokens) {
    const newEntry = { ...token }

    if (departments.includes(token.departmentId)) {
      newEntry.departmentName = ''
    } else {
      departments.push(token.departmentId)
    }

    const roleSignature = `${token.departmentId}${token.role}`
    if (roles.includes(roleSignature)) {
      newEntry.role = ''
    } else {
      roles.push(roleSignature)
    }

    results.push(newEntry)
  }

  return results
}
