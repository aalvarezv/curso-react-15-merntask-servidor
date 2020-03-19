const express = require('express')
const router = express.Router()
const tareaController = require('../controllers/tareaControlller')
const auth = require('../middleware/auth')
const { check } = require('express-validator')

//api/tareas
//crea tarea
router.post('/',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea  
)

//tareas por proyecto
router.get('/',
    auth,
    tareaController.obtenerTareas  
)

//actualizar tareas
router.put('/:id',
    auth,
    tareaController.actualizarTarea  
)

//elimina tarea
router.delete('/:id',
    auth,
    tareaController.eliminarTarea  
)

module.exports = router