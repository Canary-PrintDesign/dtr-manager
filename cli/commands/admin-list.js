import Table from 'cli-table3'
import Token from '../../src/components/auth.js'

export default async function handleCommand(input = ['']) {
  const tokens = await Token.findAll({ roles: ['super-admin'] })

  const table = new Table({
    head: ['ID', 'Token', 'Role'],
  })

  for (const { id, token, role } of tokens) {
    table.push([id, token, role])
  }

  console.log(table.toString())
}
