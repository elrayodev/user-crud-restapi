
const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', // En singular, igual que el nombre que se le asigno al exportarlo
        required: true
    }
});

CategoriaSchema.methods.toJSON = function() {

    // Sacamos __v y estado de json al momento de retornar el result y guardamos el resto de atributos en data
    const { __v, estado, ...data } = this.toObject();

    return data;

}


module.exports = model( 'Categoria', CategoriaSchema );


