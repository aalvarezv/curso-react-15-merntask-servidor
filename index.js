const express = require('express')
const conectarDB = require('./config/db')
const cors = require('cors')

//Creamos el servidor
const app = express()

//Habilitar express.json
app.use(express.json({ extended: true }))

//Conectamos a la base de datos
conectarDB()

//habilitar cors
app.use(cors())

//Puerto de la app
const port = process.env.PORT || 4000

//Import de rutas
app.use(require('./routes/index'))

app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor está funcionando en el puerto ${PORT}`)
})