const S = require('fluent-json-schema')

module.exports = {
  S,
  OBJECT: S.object(),
  UUID: S.string().format(S.FORMATS.UUID),
  DATE_TIME: S.string().format(S.FORMATS.DATE_TIME),
  DATE: S.string().format(S.FORMATS.DATE),
  OPTIONAL_UUID: S.anyOf([S.null(), S.string().format(S.FORMATS.UUID)]),
  BOOLEAN_FALSE: S.boolean().default(false),
  STRING: S.string(),
  NUMBER: S.number(),
  URL: S.string().format(S.FORMATS.URL),
  STRING_STATUS_UNPUBLISHED: S.enum(['published', 'unpublished']).default('unpublished'),
}
