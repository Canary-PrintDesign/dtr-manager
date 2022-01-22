const Department = require('../components/department.js')

module.exports = async function deleteDepartment ({ department, project }) {
  department = department.id || department
  project = project.id || project

  return Department.remove({ department, project })
}
