const { Router } = require( 'express' );
const { check } = require('express-validator');

const { login, googleSignIn } = require('../controllers/auth-controllers');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('psswd', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.post('/google', [
    check('id_token', 'El id token es necesario').not().isEmpty(),
    validarCampos
], googleSignIn);

module.exports = router;
