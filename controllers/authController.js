const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.autenticarUsuario = async(req, res) => {

    //revisar si hay errores con el express-validator aplicado con el check en el routes/auth
    const errores = validationResult(req)
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    const { email, password } = req.body

    try {
        //revisa que el usuario existe
        let usuario = await Usuario.findOne({ email })
        if (!usuario) {
            return res.status(400).json({
                msg: 'El usuario no existe'
            })
        }
        //revisar el password
        const passCorrecto = await bcryptjs.compare(password, usuario.password)
        if(!passCorrecto){
            return res.status(400).json({
                msg: 'El password es incorrecto'
            })
        }
        
        //si el usuario es válido crear y firmar el jsonwebtoken
        const payload = {
            usuario: {
                id: usuario.id
            }
        }

        //firmar el jsonwebtoken 
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600, //segundos 1 hora
        }, (error, token) => {
            if (error) throw error
            res.json({ token })
        })


    } catch (error) {
        console.log(error)
        res.status(400).send('Hubo un error')
    }
}

//Obtiene que usuario está autenticado.
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password')

        res.json({usuario})

    } catch (error) {
        console.log(error)
        res.status(400).send('Hubo un error')
    }
} 