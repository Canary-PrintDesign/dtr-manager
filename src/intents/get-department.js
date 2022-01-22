const Department = require('../components/department.js')

module.exports = async function getDepartment ({ department, project }) {
  department = department?.id || department
  project = project?.id || project

  return Department.findWith({
    id: department,
    project,
  })
}
