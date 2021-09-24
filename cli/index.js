#!/usr/bin/env node

/**
 * dtr
 *
 * @author Gregory Daynes <https://github.com/gregdaynes>
 */

import Init from './utils/init.js'
import Cli from './utils/cli.js'
import log from './utils/log.js'
import Select from './utils/prompt-select.js'
import handleCommand from './handle-command.js'
import db from '../src/lib/database.js'

const input = Cli.input
const flags = Cli.flags
const { clear, debug } = flags

await Init({ clear })
input.includes('help') && Cli.showHelp(0)
await handleCommand(input)
await db.database.destroy()
debug && log(flags)
