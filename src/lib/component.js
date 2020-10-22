const Joi = require('joi')

exports.findAll = async (repo, fn, props) => {
  const data = await repo.findAll({ ...props })
  return data.map(async item => await fn(item))
}

exports.findWith = async (repo, fn, props) => {
  const data = await repo.findByProp({ ...props })
    .catch(() => {})

  return await fn({ ...data })
}

exports.save = async (repo, fn, props) => {
  const storedData = await repo.store(props)
  return fn({ ...storedData })
}

exports.serialize = (props = {}) => ({ ...props })

exports.create = async (schema, props = {}) =>
  await schema.validateAsync(props, { stripUnknown: true })

exports.schema = (schema) =>
  Joi.object(schema)

exports.types = {
  guid: Joi.string().guid(),
  string: Joi.string()
}
