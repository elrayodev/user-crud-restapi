const { Router } = require( 'express' );
const { check } = require('express-validator');
const { JsonWebTokenError } = require('jsonwebtoken');

const { request, response } = require( 'express' );

const { validarJWT, validarCampos, esAdmin } = require( '../middlewares' );

const { productoExistePorId, categoriaExistePorId, productoExistePorNombre, categoriaExistePorNombre } = require('../helpers/db-validators');

const { productos } = require('../controllers');

const router = Router();

router.get( '/', productos.getProductos );

router.get( '/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( productoExistePorId ),
    validarCampos
], productos.getProductoById );

router.get( '/:id/:nombre', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( categoriaExistePorId ),
    check('nombre').custom( productoExistePorNombre ),
    validarCampos
],productos.getProductoByCategoria );

router.post( '/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    //check('categoria', 'La categoria no es un id mongo').isMongoId(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    //check('categoria').custom( categoriaExistePorId ),
    validarCampos
], productos.createProducto );

router.put( '/:id', [
    validarJWT,
    // check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( productoExistePorId ),
    // check('nombre').custom( productoExistePorNombre ),
    validarCampos
], productos.updateProducto );

router.delete( '/:id', [
    validarJWT,
    esAdmin,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( productoExistePorId ),
    validarCampos
], productos.deleteProducto );

module.exports = router;