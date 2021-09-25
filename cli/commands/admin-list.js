import Token from '../../src/components/auth.js'

export default async function handleCommand(input = ['']) {
  for (const token of await Token.findAll({ roles: ['super-admin'] })) {
    if (token) console.log(token)
  }
}
