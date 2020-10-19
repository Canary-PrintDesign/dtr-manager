const crypto = require('crypto')
const add = require('date-fns/add')
const AuthTokenRepo = require('./auth-token-repo')
const Component = require('lib/component')

exports.create = create
function create () {
  return async (props = {}) => ({
    id: props.id,
    token: props.token,
    department: props.department,
    expiryDate: props.expiryDate || props.expiry_date,
    canceled: props.canceled
  })
}

exports.setExpiryDate = ({ days = 8 } = {}) =>
  async (props = {}) => {
    const expiryDate = add(new Date(), { days })
    return create()({ ...props, expiryDate })
  }

exports.generateToken = ({ algorithm = 'sha256' } = {}) =>
  async (props = {}) => {
    const token = await hash(props)

    return create()({ ...props, token })
  }

exports.save = (repo = AuthTokenRepo) =>
  async (props = {}) =>
    await Component.save(repo, create(), await serialize(props))

exports.findWith = (repo = AuthTokenRepo) =>
  async (props) =>
    await Component.findWith(repo, create(), props)

exports.expireToken = () =>
  async (props = {}) =>
    create()({ ...props, canceled: true })

function serialize (props = {}) {
  const data = {
    ...props,
    expiry_date: props.expiryDate
  }

  delete data.expiryDate

  return data
}

async function hash (props = {}, { algorithm = 'sha256' } = {}) {
  const payload = JSON.stringify({
    expiryDate: props.expiryDate,
    department: props.department
  })

  return await crypto.createHash(algorithm)
    .update(payload)
    .digest('hex')
}
