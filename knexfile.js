const {
  DB_NAME: database,
  DB_HOST: host,
  DB_USER: user,
  DB_PASSWORD: password,
  DB_PORT: port,
  DB_SSL: ssl,
} = require('./bin/env')

const config = {
  client: 'postgres',
  connection: {
    host,
    port,
    user,
    password,
    database,
    ssl,
    charset: 'utf8',
  },
}

module.exports = config
