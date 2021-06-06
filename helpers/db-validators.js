const Role = require('../models/role');
const Usuario = require('../models/user');


const esRolValido = async( rol = '' ) => {

    const existeRol = await Role.findOne( { rol } );

    if( !existeRol ){
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }

}

const emailExiste = async( correo = '' ) => {

    const existeEmail = await Usuario.findOne( { correo } );

    if( existeEmail ) {
        throw new Error(`El email ${ correo } ya está registrado`);
    }
}

const usuarioExistePorId = async( _id ) => {

    const existeUsuario = await Usuario.findById( { _id } );

    if( !existeUsuario ){
        throw new Error(`El id no se ha encontrado entre los registros`);
    }

}

module.exports = {
    esRolValido,
    emailExiste,
    usuarioExistePorId
}