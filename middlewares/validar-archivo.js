const { response } = require('express');

const validarArchivoSubir = ( req, res, next ) => {


    /* Se ejecuta si no existe:
        req.files,
        si length de object.keys( req.files ) es igual a 0, osea que no se ha enviado algún elemento,
        si no existe la propiedad archivo en req.files
    */


    if( !req.files || Object.keys( req.files ).lenght === 0 || !req.files.archivo ){
        
        return res.status(400).json({
            msg: 'No hay archivos para subir - validarArchivoSubir'
        });
        
    }

    next();

}

module.exports = {
    validarArchivoSubir
}