const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/user');

const validarJWT = async( req = request , res = response, next ) => {

    const token = req.header('auth-token');

    if( !token ){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try{

        // Verificamos si token es válido
        const { uid }= jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        // Creamos prop usuarioAuth en objeto req
        const usuario = await Usuario.findById( uid );

        if( !usuario ){
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en DB'
            });
        }

        // Validamos estado de usuario
        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Token no válido - Usuario con estado false'
            });
        }

        req.usuarioAuth = usuario;

        // Creamos prop uid en objeto req
        req.uid = uid;

    }catch(err){

        console.log(err);
        res.status(401).json({
            msg: 'Token no válido'
        });
        
    }

    next();
}

module.exports = {
    validarJWT
}