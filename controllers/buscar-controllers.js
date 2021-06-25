const { request, response } = require('express');

const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto, Role } = require('../models');

const req = request;
const res = response;

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles',
];

const buscarUsuarios = async( termino = '', res ) => {

    const esMongoID = ObjectId.isValid( termino );

    if( esMongoID ){
        const usuario = await Usuario.findById( termino );
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });
    }

    const regex = new RegExp( termino, 'i' ); // 'i' insensible a las mayusculas y minusculas

    const usuarios = await Usuario.find({ 
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
     });

    // console.log(usuarios.nombre)

    res.json({

        results: usuarios

    });

}

const buscarCategoria = async( termino = '', res ) => {
 
    const esMongoID = ObjectId.isValid( termino );

    if( esMongoID ){
        const categoria = await Categoria.findById( termino );
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    const regex = new RegExp( termino, 'i' ); // 'i' insensible a las mayusculas y minusculas

    const categorias = await Categoria.find( { nombre: regex, estado: true } );

    console.log(categorias);

    res.json({

        results: categorias

    });

}

const buscarProductos = async( termino = '', res ) => {

    const esMongoID = ObjectId.isValid( termino );

    if( esMongoID ){
        const producto = await Producto.findById( termino );
        return res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }

    const regex = new RegExp( termino, 'i' ); // 'i' insensible a las mayusculas y minusculas

    const productos = await Producto.find( { nombre: regex, estado: true } )
                        .populate('categoria', 'nombre')
                        .populate('usuario', 'nombre');

    console.log(productos);

    res.json({

        results: productos

    });

}

const buscarProductosByCategoria = async(categoria = '', res ) => {

    // console.log('Entrango a función buscar productos by id');
    // console.log( req.params );

    const categoriaID = categoria;
    console.log(categoriaID);
    // console.log(categoriaID);

    if( !ObjectId.isValid( categoriaID ) ) {
        return res.status(400).json({
            msg: 'Esta búsqueda se hace por id válido de mongo'
        });
    }

    const productos = await Producto.find({ categoria: ObjectId( categoriaID ) });
    console.log(productos);
    res.json({
        results: productos
    });

}



const busqueda = ( req, res ) => {

    const params = req.params;

    const numParams = Object.keys( req.params ).length;

    if( numParams == '1' ){
        // console.log('Un param');
        var categoria = params.categoria

        buscarProductosByCategoria( categoria, res );

    }else{
        // console.log('Dos params');
        var { coleccion, termino } = params;

        if( !coleccionesPermitidas.includes( coleccion ) ){
        
            res.status(400).json({
                msg: `Las coleccciones permitidas son: ${ coleccionesPermitidas }`
            });
    
        }

        switch( coleccion ){

            case 'usuarios':
                buscarUsuarios( termino, res );    
            break;
    
            case 'categorias':
                    buscarCategoria( termino, res );
            break;
    
            case 'productos':
                    buscarProductos( termino, res );
            break;
    
            default:
                res.status(500).json({
                    msg: 'Busqueda aún no implementada'
                });
    
        }

    }

    // if( !coleccionesPermitidas.includes( coleccion ) ){
        
    //     res.status(400).json({
    //         msg: `Las coleccciones permitidas son: ${ coleccionesPermitidas }`
    //     });

    // }

    // switch( coleccion ){

    //     case 'usuarios':
    //         buscarUsuarios( termino, res );    
    //     break;

    //     case 'categorias':
    //             buscarCategoria( termino, res );
    //     break;

    //     case 'productos':
    //             buscarProductos( termino, res );
    //     break;

    //     default:
    //         res.status(500).json({
    //             msg: 'Busqueda aún no implementada'
    //         });

    // }

}


module.exports = {
    busqueda,
    buscarProductosByCategoria
}