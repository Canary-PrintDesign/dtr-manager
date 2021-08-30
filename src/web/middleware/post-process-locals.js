module.exports = () => async (req, res, next) => {
  try {
    const locals = res.locals
    const { project } = req.context

    res.locals = {
      ...locals,
      title: `${locals.title} - ${project.name}`,
    }

    next()
  } catch (err) {
    next(err)
  }
}
