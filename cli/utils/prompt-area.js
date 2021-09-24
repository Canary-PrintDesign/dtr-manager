import Token from '../../src/components/auth.js'
import Select from './prompt-select.js'

export default async function promptArea([_, initCommand, ...args]) {
  const areas = {
    token: {
      list: Token.findAll,
    },
  }

  const selectedArea = await Select({
    choices: ['Token', 'Agent', 'Department'],
    message: 'Select an area',
  })

  return areas[selectedArea.toLowerCase()]
}
