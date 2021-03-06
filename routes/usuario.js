var express= require('express');
var bcrypt =require('bcryptjs');
var jwt = require('jsonwebtoken');
//var SEED = require('../config/config').SEED;

var mdAutenticacion = require('../middlewares/autenticacion');
var app= express();

//Rutas
var Usuario = require('../models/usuario');



//******************************** */
//Obtener todos los usuarios
//******************************** */
app.get('/', (req, res, next ) => {

var desde = req.query.desde || 0;
desde = Number(desde);

Usuario.find({}, 'nombre email img role')
.skip(desde)
.limit(5)

    .exec(

        (err, usuarios)=>{
            if (err){
                return res.status(500).json({
        
                    ok: false,
                    mensaje: 'Error cargando usuario',
                    errors: err
        
                });
            }
            Usuario.count({},(err, conteo)=>{
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios,
                    total:conteo
                });
        

            })
            
   
    })


});

/******************************** */
/* Middleware Verificar Token
/****************************** */

// app.use('/',(req, res, next )=>{

//     var token = req.query.token;
//     jwt.verify( token, SEED, (err, decoded)=>{

//         if(err){

//             return res.status(401).json({
//                 ok:false,
//                 mensaje:'Error al buscar usuario no autorizado, Token Incorrecto',
//                 errors: err
//             })

//         }
//         next();

//     });
// });





/*==========================*/
/* ACTUALIZAR USUARIO       */
/*==========================*/

app.put('/:id', mdAutenticacion.verificaToken, (req, res)=>{

    var body = req.body;
    var id = req.params.id;

    Usuario.findById( id, (err, usuario)=>{

        if (err){
            return res.status(500).json({
    
                ok: false,
                mensaje: 'Error Al buscar usuario',
                errors: err
    
            });
            
        }  
        if (!usuario){
            return res.status(400).json({
    
                ok: false,
                mensaje: 'Error Al buscar usuario con id' + id + ' no existe',
                errors:{ message: 'No existe un usuario con ese ID'}
    
            }); 
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save ((err, usuarioGuardado)=>{

            if (err){
                return res.status(400).json({
        
                    ok: false,
                    mensaje: 'Error Al actualizar usuario',
                    errors: err
        
                });
                
            }  
            usuarioGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                usuariotoken: req.usuario
            }); 

        })

    })

    
});

/*=========================*/
/* CREAR USUARIO          */
/*========================*/
app.post('/', mdAutenticacion.verificaToken, (req, res)=>{

    var body = req.body;
    
    var usuario = new Usuario({
        nombre : body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save (( err, usuarioGuardado)=> {
        if (err){
            return res.status(400).json({
    
                ok: false,
                mensaje: 'Error salvando usuario',
                errors: err
    
            });
            
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });

    })
   
})

//****************** */
//ELIMINACION USUARIOS
//***************** */

app.delete('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{

        if (err){

            return res.status(500).json({
                ok:false,
                mensaje:'Error al borrar usuario',
                errors: err
            })
        }

        if (!usuarioBorrado){

            return res.status(400).json({
                ok:false,
                mensaje:'No existe usuario con ese id',
                errors: {message: 'No existe un usuario con ese id'}
            })
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    })

});

module.exports = app;