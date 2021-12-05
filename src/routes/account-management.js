const GetUserRoles = require('../intents/get-user-roles.js')
const GetProjectAuthTokens = require('../intents/get-project-auth-tokens.js')
const GetDepartments = require('../intents/get-departments.js')
const Role = require('../components/role.js')
const { requireAdmin } = require('../lib/helper-auth.js')
const { pipeWith } = require('../lib/utils.js')

const getDepartments = async (project) => await GetDepartments({ project })

const getRoles = async (roles) => await Role.findAll({ roles })

function transformForSelect (key, value) {
  return function (arr) {
    return arr.map((obj) => ({ key: obj[key], value: obj[value] }))
  }
}

module.exports = async (fastify) => {
  fastify.get('/account-management', async (req, reply) => {
    requireAdmin(req.user)

    const {
      data: { project },
      hostname,
      user,
    } = req
    const roleList = GetUserRoles({ userRole: user.role })
    const tokens = await GetProjectAuthTokens({ project, roleList })

    const departments = await pipeWith(
      project,
      getDepartments,
      transformForSelect('id', 'name'),
    )

    const roles = await pipeWith(
      roleList,
      getRoles,
      transformForSelect('id', 'role'),
    )

    const title = 'Account Management'
    const baseLoginUrl = `${hostname}/login/`

    return reply.view('account-management', {
      baseLoginUrl,
      departments,
      project,
      roles,
      title,
      tokens,
      user,
    })
  })
}
