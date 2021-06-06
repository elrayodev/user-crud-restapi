require('dotenv').config();  //Importaciones de node usualmente antes de las de terceros

const Server = require('./models/server');

const server = new Server();

server.listen();