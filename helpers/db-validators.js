const { Categoria, Role, Usuario, Producto } = require('../models');
// const Role = require('../models/role');
// const Usuario = require('../models/user');
// const Categoria = require('../models/categoria');


// -------------------------- VALIDACIONES DE COLLECTION ROLE EN BD --------------------------

// Valida si el rol existe en bd
const esRolValido = async( rol = '' ) => {

    const existeRol = await Role.findOne( { rol } );

    if( !existeRol ){

        throw new Error(`El rol ${ rol } no está registrado en la BD`);

    }

}

// -------------------------- VALIDACIONES DE COLLECTION USUARIO EN BD --------------------------

// Valida si el mail existe
const emailExiste = async( correo = '' ) => {

    const existeEmail = await Usuario.findOne( { correo } );

    if( existeEmail ) {

        throw new Error(`El email ${ correo } ya está registrado`);

    }

}

// Valida si usuario existe por id
const usuarioExistePorId = async( _id ) => {

    const existeUsuario = await Usuario.findById( { _id } );

    if( !existeUsuario ){

        throw new Error(`El id no se ha encontrado entre los registros`);

    }

}

// -------------------------- VALIDACIONES DE COLLECTION CATEGORIAS EN BD --------------------------

// Valida si la categoría existe por id
const categoriaExistePorId = async( id ) => {

    const existeCategoria = await Categoria.findById( id );

    if( !existeCategoria ){

        throw new Error(`El id ${ id } no se ha encontrado entre los registros`);

    }

    const { estado } = existeCategoria;
     
    if ( !estado ){

        throw new Error(`La categoría ${ existeCategoria.nombre } se encuentra restringida`);
        
    }

}

// Valida si la categoría ya no se encuentra funcional {estado: false}

// const categoriaRestringida = async( id ) => {

//     const { estado, nombre } =  await Categoria.findById( id );

//     if( !estado ){

//         throw new Error(`La categoria ${ nombre } se encuentra restringida`);

//     }

// }


// Valida si la categoría existe por nombre
const categoriaExistePorNombre = async( nombre ) => {

    if( !nombre ){
        throw new Error('La categoría no existe');
    }

    const nombreUpper = nombre.toUpperCase();

    const categoria = await Categoria.findOne({ nombre: nombreUpper });

    if( categoria ){

        throw new Error(`La categoria ${ categoria.nombre } ya está registrada en la bd`);
    
    }

}

// -------------------------- VALIDACIONES DE COLLECTION PRODUCTO EN BD --------------------------

// Valida si el producto existe por id
const productoExistePorId = async( id ) => {

    const existeProducto = await Producto.findById( id );

    if( !existeProducto ){

        throw new Error(`El id ${ id } no se ha encontrado entre los registros`);

    }

    const { estado } = existeProducto;
     
    if ( !estado ){

        throw new Error(`La categoría ${ existeProducto.nombre } se encuentra restringida`);
        
    }

}

// Valida si la categoría existe por nombre
const productoExistePorNombre = async( nombre ) => {

    if( !nombre ){
        throw new Error('El producto no existe');
    }

    const nombreUpper = nombre.toUpperCase();

    const producto = await Producto.findOne({ nombre: nombreUpper });

    if( producto ){

        throw new Error(`La categoria ${ producto.nombre } ya está registrada en la bd`);
    
    }

}

// -------------------------- VALIDACIONES DE COLLECTIONES EN BD --------------------------
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida =  colecciones.includes( coleccion );

    if( !incluida ){
        throw new Error(`La coleccion ${ coleccion } no es permitida - colecciones permitidas ${ colecciones }`);
    }

    return true;

}

module.exports = {
    esRolValido,
    emailExiste,
    usuarioExistePorId,
    categoriaExistePorId,
    // categoriaRestringida,
    categoriaExistePorNombre,
    productoExistePorId,
    productoExistePorNombre,
    coleccionesPermitidas
}