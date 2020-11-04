const env = process.env

module.exports = {
  dbName: env.PSQL_DB,
  dbHost: env.PSQL_HOST,
  dbUsername: env.PSQL_USER,
  dbPassword: env.PSQL_PASSWORD,
  dbPort: isTest() ? env.PSQL_TEST_PORT : env.PSQL_PORT,
  dbSSL: (env.PSQL_SSL === 'true'),
  httpPort: env.HTTP_PORT,
  httpMaxConnectionTime: env.HTTP_MAX_CONNECTION_TIME
}

function isTest () {
  return env.NODE_ENV === 'test'
}
