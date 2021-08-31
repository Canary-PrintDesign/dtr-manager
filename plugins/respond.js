module.exports = () => async (req, res, next) => {
  const requestData = {
    method: req.method,
    path: req.path,
  }

  try {
    const locals = await res.locals
    const data = await res.data

    if (data) return res.json(data)
    res.render(res.view, locals)
  } catch (err) {
    next(err)
  }
}
