const express = require('express')
const web = require('./web')
const path = require('node:path')

const app = express()

module.exports = app

app.disable('x-powered-by')
app.use('/assets', express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'web/views'))
app.set('view engine', 'pug')

app.use('/', web)
