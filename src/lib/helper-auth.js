const createError = require('http-errors')

exports.requireCrew = ({ isCrew }) => {
  if (!isCrew) throw createError(401)
}

exports.requireAdmin = ({ isAdmin }) => {
  if (!isAdmin) throw createError(401)
}

exports.requireProjectAdmin = ({ isProjectAdmin }) => {
  if (!isProjectAdmin) throw createError(401)
}

exports.requireSuperAdmin = ({ isSuperAdmin }) => {
  if (!isSuperAdmin) throw createError(401)
}
