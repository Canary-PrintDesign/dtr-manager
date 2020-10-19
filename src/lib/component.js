exports.findAll = async (repo, create, props) => {
  const data = await repo.findAll({ ...props })
  return data.map(async item => await create(item))
}

exports.findWith = async (repo, create, props) => {
  const data = await repo.findByProp({ ...props })
    .catch(() => {})

  return await create({ ...data })
}

exports.save = async (repo, create, props) => {
  const storedData = await repo.store(props)
  return create({ ...storedData })
}

exports.serialize = (props = {}) => ({ ...props })
