const S = require('fluent-json-schema')

module.exports = S.object()
  .prop('DB_NAME', S.string())
  .required()
  .prop('DB_PASSWORD', S.string())
  .required()
  .prop('DB_USER', S.string())
  .required()
  // DB port needs to be set in the .env file for Docker setup
  .prop('DB_PORT', S.string())
  .required()
  .prop('DB_HOST', S.string().default('127.0.0.1'))
  .prop('DB_SSL', S.boolean().default(false))
  .prop('HTTP_PORT', S.number().default(3000))
  .prop('HTTP_MAX_CONNECTION_TIME_SECONDS', S.number().default(30))
  .prop('ORIGIN', S.string().default('localhost'))