const Project = require('../../components/project')

module.exports = () => async (req, _res, next) => {
  try {
    const project = await Project.findWith({ hostname: req.hostname })
    req.context = { ...req.context, project }
    next()
  } catch (err) {
    next(err)
  }
}
