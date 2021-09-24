import Select from './utils/prompt-select.js'
import { toTitleCase } from '../src/lib/utils.js'

const commands = {
  'Project Token List': await import('./commands/project-token-list.js'),
  'Project Token Create': await import('./commands/project-token-create.js'),
}

export default async function handleCommand(input = ['']) {
  const choices = Object.keys(commands)

  const command = await Select({
    message: 'Choose command',
    choices,
  })

  await commands[command].default.call()
}
