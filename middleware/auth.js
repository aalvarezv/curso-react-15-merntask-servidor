const jwt = require('jsonwebtoken')


module.exports = function(req, res, next){

    //leer token del header
    const token = req.header('x-auth-token')
    //console.log(token)
    //revisar si no hay token
    if(!token){
        return res.status(401).json({
            msg: 'No hay token, permiso no válido'
        })
    }
    //validar el token
    try {
        //verifica si el token es valido
        const cifrado = jwt.verify(token, process.env.SECRETA)

        //agrega el usuario al request, 
        //cuando creamos el token (al hacer login) en la parte del payload, agregamos el usuario
        //y este payload es parte del token, con eso disponibilizamos el id del usuario en el token.
        req.usuario = cifrado.usuario

        next() //permite que avance al siguiente middleware

        
    } catch (error) {
        res.status(401).json({msg: 'Token no válido'})
    }

}