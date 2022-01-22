const { randomUUID } = require('node:crypto')
const { btoa } = require('node:buffer')
const { Model } = require('../lib/database.js')
const { OBJECT, STRING, NUMBER, UUID, OPTIONAL_UUID, BOOLEAN_FALSE } = require('../lib/helper-schema.js')

const schema = OBJECT
  .prop('id', NUMBER)
  .prop('token', STRING)
  .required()
  .prop('role', UUID)
  .required()
  .prop('isActive', BOOLEAN_FALSE)
  .prop('project', OPTIONAL_UUID)
  .prop('department', OPTIONAL_UUID)

module.exports = class Token extends Model {
  static tableName = 'tokens'

  static get jsonSchema () {
    return schema.valueOf()
  }

  static async save (authProps) {
    return Token.query().insert({ ...authProps })
  }

  static async fetch (token) {
    return Token.query().where({ token })
  }

  static async findAll ({
    project,
    roles,
  } = {}) {
    return Token.query()
      .select('tokens.*', 'roles.role as role')
      .where((builder) => {
        if (project) builder.where({ project })
        if (roles) builder.whereIn('roles.role', roles)
      })
      .join('roles as roles', 'roles.id', 'tokens.role')
  }

  static async departmentRoleToken ({
    project,
    roles,
  }) {
    return Token.query()
      .select(
        'tokens.token',
        'roles.role',
        'departments.name as department_name',
        'departments.id as department_id',
      )
      .leftJoin('roles', 'roles.id', 'tokens.role')
      .leftJoin('departments', 'departments.id', 'tokens.department')
      .whereIn('roles.role', roles)
      .where('tokens.project', project)
      .orderBy('departments.name', 'ASC')
      .orderBy('roles.role', 'ASC')
  }

  static async createToken ({
    project,
    department,
    role,
  }) {
    return await Token.save({
      project,
      department,
      role,
      token: generateToken(),
      isActive: true,
    })
  }
}

function generateToken () {
  return btoa(randomUUID()).substring(0, 6)
}
