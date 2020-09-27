const { dbName, dbHost, dbUsername, dbPassword, dbPort } = require('lib/env')

module.exports = {
  client: 'postgres',
  connection: {
    host: dbHost,
    port: dbPort,
    user: dbUsername,
    password: dbPassword,
    database: dbName,
    charset: 'utf8'
  }
}
