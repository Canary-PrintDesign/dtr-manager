const Department = require('../components/department.js')

module.exports = async function getDepartments ({ project }) {
  project = project.id || project

  return await Department.findAll({ project })
}
