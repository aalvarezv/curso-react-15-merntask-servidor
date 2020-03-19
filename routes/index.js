const express = require('express')
const app = express()

app.use('/api/usuarios', require('./usuarios'))
app.use('/api/auth', require('./auth'))
app.use('/api/proyectos', require('./proyectos'))
app.use('/api/tareas', require('./tareas'))

module.exports = app