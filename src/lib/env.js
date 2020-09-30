const env = process.env

module.exports = {
  dbName: isTest() ? env.PSQL_TEST_DB : env.PSQL_DB,
  dbHost: isTest() ? env.PSQL_TEST_HOST : env.PSQL_HOST,
  dbUsername: isTest() ? env.PSQL_TEST_HOST : env.PSQL_USER,
  dbPassword: isTest() ? env.PSQL_TEST_PASSWORD : env.PSQL_PASSWORD,
  dbPort: isTest() ? env.PSQL_TEST_PORT : env.PSQL_PORT,
  dbSSL: (env.PSQL_SSL === 'true'),
  httpPort: env.HTTP_PORT,
  httpMaxConnectionTime: env.HTTP_MAX_CONNECTION_TIME
}

function isTest () {
  return env.NODE_ENV === 'test'
}
