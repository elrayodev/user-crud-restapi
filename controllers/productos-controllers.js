const { response, request } = require( 'express' );

const { Producto, Categoria } = require('../models');

const req = request;
const res = response;

// Obtener todas las categorias, PUBLICO
const getProductos = async( req, res ) => {

    const { limite = 5, desde = 0 } = req.query;
    const q = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments( q ), // Contamos todos aquellos que tengan su estado en true
        Producto.find( q ) // Treaemos solo aquellos que tengan su estado en true
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number( desde )) // .skip() nos ayuda con el punto de inicio de la paginacion
        .limit(Number( limite )) // .limit() limita la cantidad de registros que se trae por peticion
    ]);

    res.json({
        total,
        productos
    });

}

// Obtener categoria por id, PUBLICO
const getProductoById = async( req, res ) => {

    const { id } = req.params;

    const { nombre, estado, categoria } = await Producto.findById( id )
                                                .populate('usuario', 'nombre')
                                                .populate('categoria', 'nombre');

    if( !estado ){
        return res.status(401).json({
            msg:'La producto se encuentra restringida'
        });
    }

    res.json({
        msg: 'Obteniendo producto por id',
        nombre,
        categoria
    });

}

// Obtener productos por categoria
const getProductoByCategoria = async(req, res) => {

    const { id, nombre } = req.params;

    const nombreUpper = nombre.toUpperCase();

    const categoria = await Categoria.findById( id );

    if( !categoria ){
        res.status(400).json({
            msg: `La categoría ${ nombreUpper } no está regitrada en la BD`
        });
    }

    // console.log(nombre, categoria.nombre);

    if( nombreUpper != categoria.nombre ){
        return res.status(400).json({
            msg: 'El nombre enviado no concuerda con nombre de categoria de id enviado'
        });
    }

    const productos = await Producto.find({ categoria: categoria.id, estado: true})
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    // console.log(productos);

    res.json({
        msg: `Retriving products belonging to ${ nombreUpper } category`,
        productos
    });

}

// Crear categoria, privado con cualquier rol. Cualquiera que tenga un token válido
const createProducto = async( req, res ) => {

    const { estado, usuario, ...body } = req.body

    const nombreProducto = body.nombre.toUpperCase();
    const nombreCategoria = body.categoria.toUpperCase();

    const existeCategoria = await Categoria.findOne({  nombre: nombreCategoria });
    const existeProducto = await Producto.findOne({ nombre: nombreProducto });

    if( !existeCategoria ){
        return res.status(400).json({
            msg: `La categoría ${ nombreCategoria } no se registrada en la BD`
        });
    }

    if( existeProducto ){
        return res.status(400).json({
            msg: `El producto ${ nombreProducto } ya está registrado en la BD`
        });
    };

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: nombreProducto,
        usuario: req.usuarioAuth._id,
        categoria: existeCategoria.id,
    }

    const producto = new Producto( data );

    // Guardamos en DB
    await producto.save();

    res.status(201).json({
        msg: 'Producto creado',
        producto
    });

}

// Actualizar cualquiera con token válido
const updateProducto = async( req, res ) => {

    const { id } = req.params;

    const { estado, usuario, ...data } = req.body;

    // const nombre = req.body.nombre.toUpperCase();

    if( data.nombre ){
        data.nombre = data.nombre.toUpperCase();
        const existeNombreProducto = await Producto.findOne({ nombre: data.nombre });

        if( existeNombreProducto ){
            res.status(400).json({
                msg: `El producto ${ data.nombre } ya se encuentra registrado en la BD`
            });
        }
         
    }

    if( data.categoria ){

        data.categoria = data.categoria.toUpperCase();
        categoria = await Categoria.findOne({ nombre: data.categoria });

        if( !categoria ){
            res.status(400).json({
                msg: `La categoría ${ categoria.nombre } no se encuentra registrada en la BD`
            });
        }

        data.categoria = categoria.id;

    }

    // Agregamos atributo en objeto data
    data.usuario = req.usuarioAuth._id;

    const producto = await Producto.findByIdAndUpdate( id, data, { new: true } ); // { new: true } sirve para ver reflejado los cambios en la res.json

    res.json({
        msg: 'updating data',
        producto
    });

}

// Borrar una categoria, sólo ADMIN
const deleteProducto = async( req, res ) => {

    const { id } = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true }) // { new: true } sirve para ver reflejado los cambios en la res.json
                                  .populate('usuario', 'nombre')
                                  .populate('categoria', 'nombre');

    if( !productoBorrado ){
        return res.status(400).json({
            msg: `Producto con ${ id } no encontrada`
        });
    }
    res.json({
        msg: 'deleting data',
        productoBorrado
    });
}

module.exports = {
    getProductos,
    getProductoById,
    getProductoByCategoria,
    createProducto,
    updateProducto,
    deleteProducto
}