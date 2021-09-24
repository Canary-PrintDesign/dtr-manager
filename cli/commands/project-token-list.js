import promptProject from '../utils/prompt-project.js'
import Token from '../../src/components/auth.js'

export default async function handleCommand(input = ['']) {
  const project = await promptProject(input)

  for (const token of await Token.findAll(project, { project: project.id })) {
    if (token) console.log(token)
  }
}
