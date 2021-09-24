const S = require('fluent-json-schema')
const { Model } = require('../lib/database.js')
const { randomUUID } = require('crypto')

const schema = S.object()
  .prop('id', S.number())
  .prop('token', S.string())
  .prop('isActive', S.boolean().default(false))
  .prop('role', S.string().format(S.FORMATS.UUID))
  .prop('department', S.string().format(S.FORMATS.UUID))
  .prop('project', S.string().format(S.FORMATS.UUID))

class Token extends Model {
  static get tableName() {
    return 'tokens'
  }

  static get jsonSchema() {
    return schema.valueOf()
  }
}

exports.save = save
async function save(authProps) {
  try {
    return await Token.query().insert({ ...authProps })
  } catch (err) {
    throw new Error(err)
  }
}

exports.fetch = fetch
async function fetch(token) {
  return await Token.query().where({ token })
}

exports.findAll = findAll
async function findAll({ project }) {
  return await Token.query()
    .select('tokens.*', 'roles.role as role')
    .where({ project })
    .join('roles as roles', 'roles.id', 'tokens.role')
}

exports.departmentRoleToken = departmentRoleToken
async function departmentRoleToken({ project, roles }) {
  return await Token.query()
    .select(
      'tokens.token',
      'role.role',
      'department.name as department_name',
      'department.id as department_id'
    )
    .where('tokens.project', project)
    .whereIn('role.role', roles)
    .join('roles as role', 'role.id', 'tokens.role')
    .join('departments as department', 'department.id', 'tokens.department')
    .orderBy('department.name', 'ASC')
    .orderBy('role.role', 'ASC')
}

exports.createToken = createToken
async function createToken({ project, department, role }) {
  return await exports.save({
    project,
    department,
    role,
    token: generateToken(),
    isActive: true,
  })
}

function generateToken() {
  const uuid = randomUUID()
  const encoded = btoa(uuid)

  return encoded.substring(0, 6)
}
