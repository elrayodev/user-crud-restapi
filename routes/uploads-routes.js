const { Router } = require( 'express' );
const { check } = require('express-validator');
const { cargarArchivo, getImagen, updateFileCloudinary } = require('../controllers/uploads-controllers');
const { coleccionesPermitidas } = require('../helpers');

const { validarCampos, validarArchivoSubir } = require('../middlewares');
const router = Router();


// Por validar, JWT, USUARIO VALIDO
router.post( '/', validarArchivoSubir, cargarArchivo );

router.put( '/:coleccion/:id', [
    validarArchivoSubir,
    check( 'id', 'El id debe ser de mongo' ).isMongoId(),
    check( 'coleccion' ).custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], updateFileCloudinary );

router.get( '/:coleccion/:id', [
    check( 'id', 'El id debe ser de mongo' ).isMongoId(),
    check( 'coleccion' ).custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], getImagen );

module.exports = router;
