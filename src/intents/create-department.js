const Department = require('../components/department.js')

module.exports = async function createDepartment ({ project, name, published = true }) {
  project = project.id || project
  const custom = true

  try {
    return Department.save({
      name,
      custom,
      project,
      published,
    })
  } catch (err) {
    throw new Error(err)
  }
}
