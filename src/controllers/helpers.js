const Agent = require('../components/agent')
const Department = require('../components/department')

exports.getDepartmentsForSelect = async (projectId) => {
  const departments = await Department.findAll(projectId)

  return Promise.all(departments.map(toKeyValue('id', 'name')))
}

exports.toKeyValue = toKeyValue
function toKeyValue(keyKey, valueKey) {
  return async (dataPromise) => {
    const data = await dataPromise

    return {
      key: data[`${keyKey}`],
      value: data[`${valueKey}`],
    }
  }
}

exports.getDepartment = async (departmentId) =>
  await Department.findWith({ id: departmentId })

exports.getAgent = async (agentId) => await Agent.findWith({ id: agentId })
