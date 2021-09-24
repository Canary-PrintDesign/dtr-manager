import Project from '../../src/components/project.js'
import Select from './prompt-select.js'

export default async function promptProject([_, initCommand, ...args]) {
  const projects = await Project.findAll()

  const choices = {}
  for (const project of projects) {
    choices[project.name] = project
  }

  const selectedProject = await Select({
    choices: Object.keys(choices),
    message: 'Select a project',
  })

  return choices[selectedProject]
}
