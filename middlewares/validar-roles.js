const { response } = require('express');

const esAdmin = (req, res = response, next ) => {

    if( !req.usuarioAuth  ){
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar token'
        });
    }

    const { rol, nombre } = req.usuarioAuth;

    if( rol !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: `${nombre} no es admin - No puede hacer esta función`
        });
    }

    next();

}

// almacenatos todos los parametros en roles con ...
const tieneRol = ( ...roles ) =>{

    return ( req, res = response, next ) => {
        
        if(!req.usuarioAuth){
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar token'
            });
        }

        if( !roles.includes( req.usuarioAuth.rol ) ){
            return res.status(401).json({
                msg: `El servicio require uno de estos roles ${ roles }`
            });
        }

        next();
    }

}

module.exports = {
    esAdmin,
    tieneRol
}