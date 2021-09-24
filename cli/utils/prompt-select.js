import { to } from 'await-to-js'
import shouldCancel from 'cli-should-cancel'
import handleError from 'cli-handle-error'
import enquirer from 'enquirer'
import actions from 'enquirer/lib/combos.js'
const { Select } = enquirer

export default async ({ message, choices }) => {
  const custom = { h: 'left', j: 'down', k: 'up', l: 'right' }
  // you'll need to merge the built-in actions onto your custom actions
  // if you don't want to overwrite all of them
  actions.keys = { ...actions.keys, ...custom }

  const [err, response] = await to(
    new Select({
      message,
      choices,
      validate(value) {
        return value.length === 0 ? `Please select an option.` : true
      },
      actions,
    })
      .on(`cancel`, () => shouldCancel())
      .run()
  )

  handleError(`INPUT: `, err)
  return response
}
