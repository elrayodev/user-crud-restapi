const mongoose = require( 'mongoose' );
const dbUrl = process.env.MONGODB_ATLAS;

const dbConnection = async() => {
    
    try{

        await mongoose.connect( dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log( 'Connected to DB CLOUD' );

    } catch(error) {

        console.log( error );

        throw new Error( 'Error al inicializar la conexión a la DB' );
        
    }
}

module.exports = {
    dbConnection
}