const { response } = require('express');
const  bcrypt = require('bcryptjs');

const Usuario = require('../models/user');

const { generarJWT } = require('../helpers/generar-JWT');
const { googleVerify } = require('../helpers/google-verify');

const login = async( req, res = response ) => {

    const { correo, psswd } = req.body;
    
    try{

        // Verificar si email existe
        const usuario = await Usuario.findOne({ correo });

        if( !usuario ){
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos'
            });
        }

        // Verificar si usuario activo
        if( !usuario.estado ){
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - estado = false '
            });
        }

        // Verificar la contraseña
        const validPsswd = bcrypt.compareSync( psswd, usuario.psswd) // Compara el psswd del body con el psswd de la bd

        if( !validPsswd ){
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - psswd '
            });
        }

        // Generamos JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });

    }catch( err ){
        console.log(err);
        return res.status(500).json({
            msg: 'Hable con el admin'
        });
    }

}

const googleSignIn = async( req, res = response ) => {

    const { id_token } = req.body;

    try{
        const { correo, nombre, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        // Si usuario no existe, se crea
        if ( !usuario ) {
            const data = {
                nombre,
                correo,
                psswd: ':p',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Hable con el admin, el usuario está bloqueado'
            });
        }

        // Generamos JWT
        const token = await generarJWT( usuario.id );

        res.json({
            msg: 'Todo ok! Google SingIn',
            usuario,
            token
        });

    } catch(error) {

        res.status(400).json({
            msg: 'Token de Google no es válido'
        });
        
    }
}

module.exports = {
    login,
    googleSignIn
}