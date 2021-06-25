const { response, request } = require( 'express' );

const { Categoria } = require('../models');

const req = request;
const res = response;

// Obtener todas las categorias, PUBLICO
const getCategorias = async( req, res ) => {

    const { limite = 5, desde = 0 } = req.query;
    const q = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments( q ), // Contamos todos aquellos que tengan su estado en true
        Categoria.find( q ) // Treaemos solo aquellos que tengan su estado en true
        .populate('usuario', 'nombre')
        .skip(Number( desde )) // .skip() nos ayuda con el punto de inicio de la paginacion
        .limit(Number( limite )) // .limit() limita la cantidad de registros que se trae por peticion
    ]);

    res.json({
        total,
        categorias
    });

}

// Obtener categoria por id, PUBLICO
const getCategoriaById = async( req, res ) => {

    const { id } = req.params;

    const { nombre, estado } = await Categoria.findById( id ).populate('usuario');

    if( !estado ){
        return res.status(401).json({
            msg:'La categoria se encuentra restringida'
        });
    }

    res.json({
        msg: 'Obteniendo categoria por id',
        nombre
    });
}

// Crear categoria, privado con cualquier rol. Cualquiera que tenga un token válido
const createCategoria = async( req, res ) => {

    const nombre = req.body.nombre.toUpperCase();

    const existeCategoria = await Categoria.findOne({ nombre });

    if( existeCategoria ){
        return res.status(400).json({
            msg: `La categoría ${ nombre } ya está registrada en la BD`
        })
    };

    const usuario = {
        nombre: req.usuarioAuth.nombre,
        correo: req.usuarioAuth.correo,
        rol: req.usuarioAuth.rol,
        id: req.usuarioAuth._id
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: usuario.id
    }

    const categoria = new Categoria( data )

    // Guardamos en DB
    await categoria.save()

    res.status(201).json({
        msg: 'Categoria creada',
        categoria
    });

}

// Actualizar cualquiera con token válido
const updateCategoria = async( req, res ) => {

    const { id } = req.params;

    const { estado, usuario, ...data } = req.body;

    // const nombre = req.body.nombre.toUpperCase();

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuarioAuth._id;

    // if( await Categoria.findOne({ nombre }) ){
    //     return res.status(400).json({
    //         msg: `La categoria ${ nombre } ya se encuentra registrada en bd`
    //     });
    // }

    // const data = {
    //     nombre,
    //     usuario: req.usuarioAuth._id
    // }

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true } ); // { new: true } sirve para ver reflejado los cambios en la res.json

    res.json({
        msg: 'updating data',
        categoria
    });

}

// Borrar una categoria, sólo ADMIN
const deleteCategoria = async( req, res ) => {

    const { id } = req.params;

    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true }); // { new: true } sirve para ver reflejado los cambios en la res.json

    if( !categoriaBorrada ){
        return res.status(400).json({
            msg: `Categoría con ${ id } no encontrada`
        })
    }
    res.json({
        msg: 'deleting data',
        categoriaBorrada
    });
}

module.exports = {
    getCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria
}
