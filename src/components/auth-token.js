const crypto = require('crypto')
const add = require('date-fns/add')
const repo = require('./auth-token-repo')

module.exports = class AuthToken {
  constructor (props = {}) {
    this.id = props.id || undefined
    this.token = props.token || undefined
    this.department = props.department || undefined
    this.expiryDate = props.expiryDate || this.expiry_date || add(new Date(), { days: 8 })
    this.canceled = props.canceled || false

    if (!this.token) {
      this.token = this.generate()
    }
  }

  async getBy (props) {
    const foundAuthToken = await repo.findByProp({ ...props })
      // no auth token found
      .catch(() => {})

    return new this.constructor(foundAuthToken)
  }

  async save () {
    this.expiry_date = this.expiryDate

    delete this.expiryDate

    const data = await this.serialize()
    const storedAuthToken = await repo.store(data)

    return new this.constructor(storedAuthToken)
  }

  async expire () {
    this.canceled = true

    return this.save()
  }

  async serialize () {
    return await Promise.resolve(this.token)
      .then(token => JSON.parse(JSON.stringify({ ...this, token })))
  }

  async generate () {
    return await crypto.createHash('sha256')
      .update(JSON.stringify({ expiryDate: this.expiryDate, department: this.department }))
      .digest('hex')
  }
}
