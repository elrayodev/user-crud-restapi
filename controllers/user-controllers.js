const { response, request } = require( 'express' );

const bcrypt = require('bcryptjs');
const Usuario = require('../models/user');

const usersGet = async( req = request, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const q = { estado: true };

    // const usuarios = await Usuario.find({ q })
    //     .skip(Number( desde )) // .skip() nos ayuda con el punto de inicio de la paginacion
    //     .limit(Number( limite )); // .limit() limita la cantidad de registros que se trae por peticion

    // const totalRegistros = await Usuario.countDocuments({ q });

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments( q ),
        Usuario.find( q )
        .skip(Number( desde )) // .skip() nos ayuda con el punto de inicio de la paginacion
        .limit(Number( limite )) // .limit() limita la cantidad de registros que se trae por peticion
    ]);

    res.json({
        total,
        usuarios
        // totalRegistros,
        // usuarios
    });
};

const usersPut = async( req = request, res = response ) => {

    const { id } = req.params;

    // Desestructurando datos del body, los que quiero y aquellos que no mandar
    const { _id, psswd, google, correo, ...resto } = req.body;

    // Validar en BD
    if( psswd ){
        // Encriptando contraseña
        const salt = bcrypt.genSaltSync(); // # vueltas para encriptar (default:10)
        resto.psswd = bcrypt.hashSync( psswd, salt ); // .hashSync() para encriptar en una sola via
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json( usuario );

};

const usersPost = async ( req = request, res = response ) => {

    // Mandamos solo datos necesarios que requerimos del usuario al backend
    // Si tenemos muchos cambios se utiliza operador ...rest
    const { nombre, correo, psswd, rol }= req.body;
    const usuario = new Usuario({ nombre, correo, psswd, rol });

    // Verificar si correo existe
    const existeEmail = await Usuario.findOne({ correo });

    // Encriptando contraseña
    const salt = bcrypt.genSaltSync(); // # vueltas para encriptar (default:10)
    usuario.psswd = bcrypt.hashSync( psswd, salt ); // .hashSync() para encriptar en una sola via

    // Guardar en bd
    await usuario.save();

    res.json( usuario );

};

const usersDelete = async( req = request, res = response ) => {

    const { id } = req.params;

    const uid = req.uid;
    const userAuth = req.usuarioAuth;

    // const usuario = await Usuario.findByIdAndDelete( id );

    // Cambiamos estado de usuario en DB en vez de eliminar para la continuidad de la integridad de nuestros datos en BD
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false} );

    if( !usuario ){
        return res.status(400).json({ 
            msg: `usuario con id ${ id } no encontrado`
        });
    }

    res.json({
        msg: 'State User was successfully updated',
        usuario,
        uid,
        userAuth
    });
};

module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete
}