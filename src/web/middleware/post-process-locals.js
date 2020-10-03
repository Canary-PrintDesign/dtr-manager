const debug = require('lib/debug')('http:api:middleware:postProcessLocals')

module.exports = postProcessLocalsInit

function postProcessLocalsInit () {
  return postProcessLocals
}

async function postProcessLocals (req, res, next) {
  // debug(res.locals)

  try {
    const locals = res.locals
    const { project } = req.context

    res.locals = {
      ...locals,
      title: `${locals.title} - ${project.name}`
    }

    next()
  } catch (err) {
    next(err)
  }
}
