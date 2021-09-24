import Project from '../../src/components/project.js'

export default async function handleCommand(input = ['']) {
  const projects = await Project.findAll()

  projects.forEach((project) => console.log(project))
}
