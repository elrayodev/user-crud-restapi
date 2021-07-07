const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFiles = ( files, extensionesValidas  = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) => {

    return new Promise( ( resolve, reject ) => {

        // Extraemos el archivo de req.files
        if( !files ) {
            return reject( 'El archivo es indefinido' );
        }

        const { archivo } = files;

        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1 ];

        // Validar extensión
        if( !extensionesValidas.includes( extension )){
            console.log(`La extensión ${ extension } no es válida, extensiones válidas: ${ extensionesValidas }`);

            return reject( `La extensión ${ extension } no es válida, extensiones válidas: ${ extensionesValidas }` );

        }

        const nombreTemp = uuidv4() + '.' + extension;

        // Redireccionamos el archivo a una carpeta /uploads/
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp);

        // .mv mueve el archivo a la ruta asignada arriba
        archivo.mv( uploadPath, (err) => {

            if(err) {
                reject( err );
            }
            
            resolve( nombreTemp );

        });

    });

}

module.exports = {
    uploadFiles
}