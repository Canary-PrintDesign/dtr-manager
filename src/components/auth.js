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
  return await Token.query().where({ project })
}

exports.createToken = createToken
async function createToken({ department, role }) {
  return await exports.save({
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
