const debug = require("../../lib/debug")("http:web:controller:login");
const { getDepartmentsForSelect } = require("./helpers");

module.exports = {
  index,
};

async function index(req, res) {
  debug("index", req.params);

  const { project, authorization } = req.context;
  const departments = await getDepartmentsForSelect(project.id);

  req.context.flash =
    authorization === "valid"
      ? { type: "success", msg: "Authorized" }
      : { type: "info", msg: "Unauthorized" };

  res.view = "login";
  res.locals = {
    ...req.context,
    departments,
    title: "Login",
  };
}
