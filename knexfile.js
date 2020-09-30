const { dbName, dbHost, dbUsername, dbPassword, dbPort, dbSSL } = require('lib/env')

const config = {
  client: 'postgres',
  connection: {
    host: dbHost,
    port: dbPort,
    user: dbUsername,
    password: dbPassword,
    database: dbName,
    charset: 'utf8',
    ssl: dbSSL
  }
}

module.exports = config
