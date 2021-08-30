const {
  DB_DATABASE: dbName,
  DB_HOST: dbHost,
  DB_USERNAME: dbUsername,
  DB_PASSWORD: dbPassword,
  DB_PORT: dbPort,
  DB_SSL: dbSSL,
} = process.env

const config = {
  client: 'postgres',
  connection: {
    host: dbHost,
    port: dbPort,
    user: dbUsername,
    password: dbPassword,
    database: dbName,
    charset: 'utf8',
    ssl: dbSSL,
  },
}

module.exports = config
