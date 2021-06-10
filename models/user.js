
const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    psswd: {
        type: String,
        required: [true, 'El contraseña es obligatorio']
    },
    img: {
        type: String,
    },    
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROL']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});



UsuarioSchema.methods.toJSON = function() {
    // Sacamos __v y psswd de json al momento de retornar el result y guardamos el resto de atributos en user con ..user
    const { __v, psswd, _id, ...user } = this.toObject();

    // Cambiamos nombre de propiedad _id a uid
    user.uid = _id;
    return user;
}

module.exports = model( 'Usuario', UsuarioSchema );

