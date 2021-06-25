const express = require('express');
const app = express();
const cors = require('cors');

const { dbConnection } = require('../db/config');

class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT;

        this.paths = {

            auth:       '/api/auth',
            categorias: '/api/categorias',
            busquedas:  '/api/busquedas',
            productos:  '/api/productos',
            users:      '/api/users'
            
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

    }

    routes() {

        // Agrgaamos rutas
        this.app.use( this.paths.auth, require( '../routes/auth' ) );
        this.app.use( this.paths.users, require( '../routes/user-routes' ) );
        this.app.use( this.paths.categorias, require( '../routes/categoria-routes' ));
        this.app.use( this.paths.productos, require( '../routes/producto-routes' ));
        this.app.use( this.paths.busquedas, require( '../routes/buscar-routes' ));
        
    }

    listen() {

        this.app.listen(this.port, () => {

            console.log( `Listening on port ${this.port}` );
        
        });

    }

}

module.exports = Server;