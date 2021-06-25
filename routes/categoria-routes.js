const { Router } = require( 'express' );
const { check } = require('express-validator');
const { JsonWebTokenError } = require('jsonwebtoken');

/* Esta importación es la que nos ayuda a traer los errores
   que se integran en las request gracias al check del express-validator */
const { validarCampos,
        validarJWT,
        esAdmin 
      } = require('../middlewares');

const { categorias } = require('../controllers')

/*
const { getCategorias, 
        getCategoriaById,
        createCategoria,
        updateCategoria, 
        deleteCategoria
      } = require('../controllers/categorias-controllers');
*/

const { categoriaExistePorId, categoriaExistePorNombre } = require('../helpers/db-validators');

const router = Router();

router.get( '/', categorias.getCategorias );

router.get( '/:id', [
   check('id', 'No es un id válido').isMongoId(),
   check('id').custom( categoriaExistePorId ),
   validarCampos
], categorias.getCategoriaById );

router.post( '/', [
   validarJWT,
   check('nombre', 'El nombre es obligatorio').not().isEmpty(),
   validarCampos
], 
categorias.createCategoria );

router.put( '/:id', [
   validarJWT,
   check('nombre', 'El nombre es obligatorio').not().isEmpty(),
   check('nombre').custom( categoriaExistePorNombre ),
   check('id', 'No es un id válido').isMongoId(),
   check('id').custom( categoriaExistePorId ),
   validarCampos
], categorias.updateCategoria );

router.delete( '/:id', [
   validarJWT,
   esAdmin,
   check('id', 'No es un id válido').isMongoId(),
   check('id').custom( categoriaExistePorId ),
   //check('id').custom( categoriaRestringida ),
   validarCampos,
], categorias.deleteCategoria );

module.exports = router;