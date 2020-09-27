const app = require('express')()
const web = require('web')
const path = require('path')

module.exports = app

app.disable('x-powered-by')
app.set('views', path.join(__dirname, 'web/views'))
app.set('view engine', 'pug')

app.use('/', web)
