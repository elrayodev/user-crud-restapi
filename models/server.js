const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors'); // Middleware

const app = express();
const { dbConnection } = require('../db/config'); // Conexión a DB

class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT;

        // Rutas base
        this.paths = {

            auth:       '/api/auth',
            categorias: '/api/categorias',
            busquedas:  '/api/busquedas',
            productos:  '/api/productos',
            users:      '/api/users',
            uploads:    '/api/uploads',
            
        }

        // Conectando a BD
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicacion
        this.routes();

    }
    
    async conectarDB() {

        await dbConnection();

    }

    middlewares() {

        // Directorio publico
        this.app.use( express.static( 'public' ) );

        // Parseo y lectura de body
        this.app.use( express.json() ); // Serializa a formato json

        // CORS
        this.app.use( cors() );

        // FileUpload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {

        // Agregamos rutas
        this.app.use( this.paths.auth, require( '../routes/auth' ) );
        this.app.use( this.paths.users, require( '../routes/user-routes' ) );
        this.app.use( this.paths.categorias, require( '../routes/categoria-routes' ));
        this.app.use( this.paths.productos, require( '../routes/producto-routes' ));
        this.app.use( this.paths.busquedas, require( '../routes/buscar-routes' ));
        this.app.use( this.paths.uploads, require( '../routes/uploads-routes' ));
        

    }

    listen() {

        this.app.listen(this.port, () => {

            console.log( `Listening on port ${this.port}` );
        
        });

    }

}

module.exports = Server;