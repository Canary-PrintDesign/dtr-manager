const S = require('fluent-json-schema')
const { Model } = require('../lib/database.js')
const { randomUUID } = require('crypto')

const schema = S.object()
  .prop('id', S.number())
  .prop('token', S.string())
  .required()
  .prop('role', S.string().format(S.FORMATS.UUID))
  .required()
  .prop('isActive', S.boolean().default(false))
  .prop('project', S.anyOf([S.null(), S.string().format(S.FORMATS.UUID)]))
  .prop('department', S.anyOf([S.null(), S.string().format(S.FORMATS.UUID)]))

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
async function findAll({ project, roles } = {}) {
  return await Token.query()
    .select('tokens.*', 'roles.role as role')
    .where((builder) => {
      if (project) builder.where({ project })
      if (roles) builder.whereIn('roles.role', roles)
    })
    .join('roles as roles', 'roles.id', 'tokens.role')
}

exports.departmentRoleToken = departmentRoleToken
async function departmentRoleToken({ project, roles }) {
  return await Token.query()
    .select(
      'tokens.token',
      'roles.role',
      'departments.name as department_name',
      'departments.id as department_id'
    )
    .leftJoin('roles', 'roles.id', 'tokens.role')
    .leftJoin('departments', 'departments.id', 'tokens.department')
    .whereIn('roles.role', roles)
    .where('tokens.project', project)
    .orderBy('departments.name', 'ASC')
    .orderBy('roles.role', 'ASC')
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
