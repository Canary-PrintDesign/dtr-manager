const {
  DB_NAME: database,
  DB_HOST: host,
  DB_USERNAME: user,
  DB_PASSWORD: password,
  DB_PORT: port,
  DB_SSL: ssl,
} = process.env

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
