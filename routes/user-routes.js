const { Router } = require( 'express' );
const { check } = require('express-validator');

const { usersGet, 
        usersPut, 
        usersPost, 
        usersDelete, 
        usersPatch } = require( '../controllers/user-controllers' );

const { esRolValido, emailExiste, usuarioExistePorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.get( '/', usersGet );

// :algo express automaticamente carga dicho param  como propiedad al objeto req
// check solo almacena en un objeto los errores que se encontraron en la req, luego se validan en la funcion validarCampos
router.put('/:id', [
        check('id', 'No es un id válido').isMongoId().custom( usuarioExistePorId ),
        check('rol').custom( esRolValido ),
        validarCampos
], usersPut );

router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('psswd', 'La contraseña es obligatoria, debe de contener más de 6 caracteres, incluyendo 1 mayuscula, un digito y un simbolo').isLength({ min:7 }),
        check('correo', 'El correo no es válido').isEmail().custom( emailExiste ),
        // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
        check('rol').custom( esRolValido ),
        validarCampos
] ,usersPost);

router.delete('/:id', [
        check('id', 'No es un id válido').isMongoId().custom( usuarioExistePorId ),
        validarCampos
], usersDelete );

router.patch('/', usersPatch );

module.exports = router;