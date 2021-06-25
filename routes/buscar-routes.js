const { Router } = require('express');

const { buscar } = require('../controllers');

const router = Router();

router.get('/:coleccion/:termino', buscar.busqueda );

router.get('/:categoria', buscar.busqueda );

module.exports = router;