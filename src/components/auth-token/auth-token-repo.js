const { findWith, store } = require("../../lib/database");
const table = "session_tokens";

module.exports = {
  findWith: findWith(table),
  store: store(table),
};
