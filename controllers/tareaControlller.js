const Tarea = require('../models/Tarea')
const Proyecto = require('../models/Proyecto')
const { validationResult } = require('express-validator')

//crea una nueva tarea
exports.crearTarea = async (req, res) => {

    //revisar si hay errores con el express-validator aplicado con el check en el routes/tareas
    const errores = validationResult(req)
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    //extrae el proyecto al que pertenece la tarea
    const { proyecto } = req.body

    try {
       
        //busca el proyecto
        const existeProyecto = await Proyecto.findById(proyecto)
        //si no existe entonces retorna un mensaje
        if(!existeProyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado'})
        }

        //revisar si el proyecto, pertenece al usuario autenticado.
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado'})
        }

        //creamos la tarea
        const tarea = new Tarea(req.body)

        //graba la tarea
        await tarea.save()
        
        res.json({tarea})
        
        
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }

}
//obtener tareas por proyecto
exports.obtenerTareas = async (req, res) => {

    //extraemos el proyecto
    const { proyecto } = req.query

    try {
        //busca el proyecto
        const existeProyecto = await Proyecto.findById(proyecto)
        //si no existe entonces retorna un mensaje
        if(!existeProyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado'})
        }

        //revisar si el proyecto, pertenece al usuario autenticado.
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado'})
        }
        //obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto: proyecto })
        res.json({ tareas })
        
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }

}

//actualizar una tarea
exports.actualizarTarea = async (req, res) => {

    //extraemos el proyecto
    const { proyecto, nombre, estado } = req.body

    try{
        //verifica si la tarea existe
        let tarea = await Tarea.findById(req.params.id)
        
        if(!tarea){
            return res.status(404).json({ msg: 'Tarea no existe'})
        }

        //busca el proyecto
        const existeProyecto = await Proyecto.findById(proyecto)
        
        //revisar si el proyecto, pertenece al usuario autenticado.
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado'})
        }

        //crear objeto con la nueva información
        const nuevaTarea = {
            nombre,
            estado
        }
       
        
        console.log(nuevaTarea)
        //guarda la tarea
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true })

        res.json({tarea})

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

exports.eliminarTarea = async ( req, res) => {

     //extraemos el proyecto
     const { proyecto } = req.query

    try {

        //busca la tarea según el id
        let tarea = await Tarea.findById(req.params.id)
        //revisar si la existe o no
        if(!tarea){
            return res.status(404).json({ msg: 'Tarea no encontrada'})
        }
        //obtiene datos del proyecto, para validar que el creador sea el mismo que el usuario autenticado.
        const existeProyecto = await Proyecto.findById(proyecto)

        //verificar el creador del proyecto sea el mismo que está autenticado.º
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado'})
        }

        tarea = await Tarea.findOneAndRemove({ _id: req.params.id })
        res.json({ msg : 'Tarea Eliminada'})
        
    } catch (error) {
         console.log(error)
         res.status(500).send('Hubo un error')
    }
    
}