const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require('express');

const { uploadFiles } = require('../helpers');
const { Usuario, Producto  } = require('../models');

const res = response;

const cargarArchivo = async(req, res ) => {

    try{

        const nombre = await uploadFiles( req.files, undefined, 'imgs' )

        console.log(nombre);

        res.json({
            nombre
        });
    
    } catch( msg ){

        res.status(400).json({
            msg
        });

    }
    
}

const updateFile = async( req, res ) =>{

    const { id, coleccion } = req.params;
    
    // Establecer valor de manera condicional
    let modelo;

    switch( coleccion ){
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if( !modelo ){
                // console.log('El id no se encuentra en la bd');
                return res.status(400).json({
                    msg: `El usuario con id: ${ modelo } no se encuentra en la base de datos`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById( id );
            if( !modelo ){
                // console.log('El id no se encuentra en la bd');
                return res.status(400).json({
                    msg: `El producto con id: ${ modelo } no se encuentra en la base de datos`
                });
            }
            break;
        default:
            // console.log('Case no validada')
            return res.status(500).json({
                msg: 'Case no validada'
            });
    }

    // Limpiar imagenes previas
    try{
        if( modelo.img ){
            // Hay que borrar la imagen del servidor 
            const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
            
            if( fs.existsSync( pathImagen ) ){
                fs.unlinkSync( pathImagen );
            }
        }
    }catch(error){
        throw new Error( error );
    }

    const nombreImg = await uploadFiles( req.files, undefined, coleccion );

    /*
        .then(
            (nombre) => {
                modelo.img = nombre
                console.log( modelo );
                modelo.save();
            },
            (error) => {
                console.log( error );
            }
        );

    if( !n ){
        return res.status(400).json({
            msg: 'El archivo es indenifido'
        });
    }
    */

    modelo.img = nombreImg;

    await modelo.save();

    console.log('Imagen actualizada', modelo);
    
    res.json({
        modelo
    })

}

const updateFileCloudinary = async( req, res ) =>{

    const { id, coleccion } = req.params;
    
    // Establecer valor de manera condicional
    let modelo;

    switch( coleccion ){
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if( !modelo ){
                // console.log('El id no se encuentra en la bd');
                return res.status(400).json({
                    msg: `El usuario con id: ${ modelo } no se encuentra en la base de datos`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById( id );
            if( !modelo ){
                // console.log('El id no se encuentra en la bd');
                return res.status(400).json({
                    msg: `El producto con id: ${ modelo } no se encuentra en la base de datos`
                });
            }
            break;
        default:
            // console.log('Case no validada')
            return res.status(500).json({
                msg: 'Case no validada'
            });
    }

    // Limpiar imagenes previas
    try{
        if( modelo.img ){
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[ nombreArr.length - 1 ];
            const [ public_id ] = nombre.split('.');
            
            cloudinary.uploader.destroy( public_id );
            
        }

        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        modelo.img = secure_url;
        
        await modelo.save();

        res.json({ modelo });

    }catch(error){
        throw new Error( error );
    }

}

const getImagen = async( req, res ) => {

    const { id, coleccion } = req.params;
    
    // Establecer valor de manera condicional
    let modelo;

    switch( coleccion ){
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if( !modelo ){
                // console.log('El id no se encuentra en la bd');
                return res.status(400).json({
                    msg: `El usuario con id: ${ modelo } no se encuentra en la base de datos`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById( id );
            if( !modelo ){
                // console.log('El id no se encuentra en la bd');
                return res.status(400).json({
                    msg: `El producto con id: ${ modelo } no se encuentra en la base de datos`
                });
            }
            break;
        default:
            // console.log('Case no validada')
            return res.status(500).json({
                msg: 'Case no validada'
            });
    }

    // Limpiar imagenes previas
    try{
        if( modelo.img ){
            // Hay que borrar la imagen del servidor 
            const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
            
            if( fs.existsSync( pathImagen ) ){
                return res.sendFile( pathImagen );
            }
        }
    }catch(error){
        throw new Error( error );
    }

    const pathNoImg = path.join( __dirname, '../assets/no-image.jpg' );
    return res.sendFile( pathNoImg );

}

module.exports = {
    cargarArchivo,
    updateFile,
    updateFileCloudinary,
    getImagen
}