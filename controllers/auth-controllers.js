const { response } = require('express');
const  bcrypt = require('bcryptjs');

const Usuario = require('../models/user');
const { generarJWT } = require('../helpers/generar-JWT');

const res = response;

const login = async( req, res) => {

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
        return res.status(500).consolejson({
            msg: 'Hable con el admin'
        });
    }

}

module.exports = {
    login
}