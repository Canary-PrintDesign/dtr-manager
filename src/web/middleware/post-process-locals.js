const debug = require('../../lib/debug')(
  'http:api:middleware:postProcessLocals'
)

module.exports = () => async (req, res, next) => {
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
