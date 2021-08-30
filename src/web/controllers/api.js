const debug = require("../../lib/debug")("http:web:controller:api");
const Agent = require("../../components/agent");
const AuthToken = require("../../components/auth-token");
const { pipeWith } = require("../../lib/utils");

module.exports = {
  requestAuthToken,
  requestAgents,
};

async function requestAuthToken(req, res) {
  debug("requestAuthToken", req.query);

  const { department } = req.query;

  const authToken = await pipeWith(
    { department },
    AuthToken.create(),
    AuthToken.generateToken(),
    AuthToken.setExpiryDate(),
    AuthToken.save()
  );

  debug("requestAuthToken", authToken);

  res.data = {
    token: await authToken.token,
  };
}

async function requestAgents(req, res) {
  debug("requestAgents", req.params, req.body, req.query);

  const { project } = req.context;
  const agents = await getAgents({
    projectId: project.id,
    departmentId: req.query.department,
  });

  res.data = { agents };
}

// Private

async function getAgents({ projectId, departmentId }) {
  const agents = await Agent.findAll(projectId, departmentId);

  return Promise.all(agents).then((res) =>
    res.map((agent) => ({
      name: agent.name,
      position: agent.position,
      department: agent.department,
    }))
  );
}
