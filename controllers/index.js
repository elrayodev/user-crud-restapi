const user = require('../controllers/user-controllers');
const auth = require('../controllers/auth-controllers');
const categorias = require('../controllers/categorias-controllers');
const productos = require('../controllers/productos-controllers');
const buscar = require('../controllers/buscar-controllers');

module.exports = {
    user,
    auth,
    buscar,
    categorias,
    productos
}