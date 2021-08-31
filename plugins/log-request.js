module.exports = () => (req, _res, next) => {
  const data = {
    method: req.method,
    path: req.path,
    params: req.params,
    headers: req.headers,
    query: req.query,
    body: req.body,
  }

  next()
}
