var express= require('express');
var bcrypt =require('bcryptjs');
var jwt = require('jsonwebtoken');
//var SEED = require('../config/config').SEED;

var mdAutenticacion = require('../middlewares/autenticacion');
var app= express();

//Rutas
var Medico = require('../models/medico');



//******************************** */
//Obtener todos los Medicos
//******************************** */
app.get('/', (req, res, next ) => {

var desde = req.query.desde || 0;
desde = Number(desde);

Medico.find({}, 'nombre img usuario hospital')
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital')
    .exec(

        (err, medicos)=>{
            if (err){
                return res.status(500).json({
        
                    ok: false,
                    mensaje: 'Error cargando medico',
                    errors: err
        
                });
            }

            Medico.count({},(err, conteo)=>{

                res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total:conteo
                });
            })
   
    })


});



/*==========================*/
/* ACTUALIZAR MEDICO      */
/*==========================*/

app.put('/:id', mdAutenticacion.verificaToken, (req, res)=>{

    var body = req.body;
    var id = req.params.id;

    Medico.findById( id, (err, medico)=>{

        if (err){
            return res.status(500).json({
    
                ok: false,
                mensaje: 'Error Al buscar medico',
                errors: err
    
            });
            
        }  
        if (!medico){
            return res.status(400).json({
    
                ok: false,
                mensaje: 'Error Al buscar medico con id' + id + ' no existe',
                errors:{ message: 'No existe un medico con ese ID'}
    
            }); 
        }
        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;
        
        medico.save ((err, medicoGuardado)=>{

            if (err){
                return res.status(400).json({
        
                    ok: false,
                    mensaje: 'Error Al actualizar medico',
                    errors: err
        
                });
                
            }  
            //Guardado.password = ':)';
            res.status(200).json({
                ok: true,
                medico: medicoGuardado,
                medicotoken: req.usuario
            }); 

        })

    })

    
});

/*=========================*/
/* CREAR MEDICO        */
/*========================*/
app.post('/', mdAutenticacion.verificaToken, (req, res)=>{

    var body = req.body;
    
    var medico = new Medico({
        nombre : body.nombre,
        usuario :  req.usuario._id,
        hospital : body.hospital
        });

    medico.save (( err, medicoGuardado)=> {
        if (err){
            return res.status(400).json({
    
                ok: false,
                mensaje: 'Error salvando medico',
                errors: err
    
            });
            
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });

    })
   
})

//****************** */
//ELIMINACION MEDICO
//***************** */

app.delete('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (err, medicoBorrado)=>{

        if (err){

            return res.status(500).json({
                ok:false,
                mensaje:'Error al borrar medico',
                errors: err
            })
        }

        if (!medicoBorrado){

            return res.status(400).json({
                ok:false,
                mensaje:'No existe medico con ese id',
                errors: {message: 'No existe un medico con ese id'}
            })
        }
        res.status(200).json({
            ok: true,
            usuario: medicoBorrado
        });
    })

});

module.exports = app;