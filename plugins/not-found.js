module.exports = () => (req, res, next) => {
  if (!res.view && !res.data) {
    res.status(404)
    res.view = '404.pug'
    res.locals = {
      ...req.context,
      title: `Page Not Found - ${req.context.project.name}`,
    }
  }

  next()
}
