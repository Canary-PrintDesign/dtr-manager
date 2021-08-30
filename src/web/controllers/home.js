module.exports = {
  index,
}

async function index(req, res) {
  res.view = 'home'
  res.locals = {
    ...req.context,
    title: 'Welcome',
  }
}
