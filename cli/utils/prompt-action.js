import Select from './prompt-select.js'

export default async function promptAction([_, initCommand, ...args], area) {
  const choices = Object.keys(area)

  const selectedAction = await Select({
    choices,
    message: 'Select an action',
  })

  return area[selectedAction]
}
