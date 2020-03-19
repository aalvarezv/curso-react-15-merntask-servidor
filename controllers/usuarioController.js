const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.crearUsuario = async(req, res) => {

    //revisar si hay errores con el express-validator aplicado con el check en el routes/usuarios
    const errores = validationResult(req)
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    const { email, password } = req.body

    try {
        //busca si hay un usuario con el email ingresado
        let usuario = await Usuario.findOne({ email })
        if (usuario) {
            return res.status(400).json({
                msg: 'El usuario ya existe'
            })
        }
        //crea nuevo usuario.
        usuario = new Usuario(req.body)

        //Hashear un password.
        const salt = await bcryptjs.genSalt(10)
        usuario.password = await bcryptjs.hash(password, salt)

        //guarda el nuevo usuario
        await usuario.save()

        //crear y firmar el jsonwebtoken
        const payload = {
            usuario: {
                id: usuario.id
            }
        }

        //firmar el jsonwebtoken 
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600, //segundos = 1 hora
        }, (error, token) => {
            if (error) throw error

            res.json({ token })
        })


    } catch (error) {
        console.log(error)
        res.status(400).send('Hubo un error')
    }
}