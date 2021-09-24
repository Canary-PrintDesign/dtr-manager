import Department from '../../src/components/department.js'
import Select from './prompt-select.js'

export default async function promptProject(
  project,
  [_, initCommand, ...args]
) {
  const departments = await Department.findAll({ project: project.id })

  const choices = {}
  for (const department of departments) {
    choices[department.name] = department
  }

  const selectedProject = await Select({
    choices: Object.keys(choices),
    message: 'Select a department',
  })

  return choices[selectedProject]
}
