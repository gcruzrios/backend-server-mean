var express= require('express');

//var SEED = require('../config/config').SEED;

var mdAutenticacion = require('../middlewares/autenticacion');
var app= express();

//Rutas
var Hospital = require('../models/hospital');



//******************************** */
//Obtener todos los hospitales
//******************************** */
app.get('/', (req, res, next ) => {

var desde = req.query.desde || 0;
desde = Number(desde);
Hospital.find({}, 'nombre usuario')
    .skip(desde)
    .limit(5)


    .populate('usuario','nombre email')
    .exec(

        (err, hospitales)=>{
            if (err){
                return res.status(500).json({
        
                    ok: false,
                    mensaje: 'Error cargando hospital',
                    errors: err
        
                });
            }

            Hospital.count({},(err, conteo)=>{
                res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total:conteo
                });
        
            
            })

            
   
    })


});



/*==========================*/
/* ACTUALIZAR HOSPITAL      */
/*==========================*/

app.put('/:id', mdAutenticacion.verificaToken, (req, res)=>{

    var body = req.body;
    var id = req.params.id;

    Hospital.findById( id, (err, hospital)=>{

        if (err){
            return res.status(500).json({
    
                ok: false,
                mensaje: 'Error Al buscar hospital',
                errors: err
    
            });
            
        }  
        if (!hospital){
            return res.status(400).json({
    
                ok: false,
                mensaje: 'Error Al buscar hospital con id' + id + ' no existe',
                errors:{ message: 'No existe un hospital con ese ID'}
    
            }); 
        }
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save ((err, hospitalGuardado)=>{

            if (err){
                return res.status(400).json({
        
                    ok: false,
                    mensaje: 'Error Al actualizar hospital',
                    errors: err
        
                });
                
            }  
            //Guardado.password = ':)';
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado,
               // hospitaltoken: req.usuario
            }); 

        })

    })

    
});

/*=========================*/
/* CREAR HOSPITAL         */
/*========================*/
app.post('/', mdAutenticacion.verificaToken, (req, res)=>{

    var body = req.body;
    
    var hospital = new Hospital({
        nombre : body.nombre,
        usuario : req.usuario._id
    });

    hospital.save (( err, hospitalGuardado)=> {
        if (err){
            return res.status(400).json({
    
                ok: false,
                mensaje: 'Error salvando hospital',
                errors: err
    
            });
            
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });

    })
   
})

//****************** */
//ELIMINACION HOSPITAL
//***************** */

app.delete('/:id', mdAutenticacion.verificaToken, (req, res)=>{
    
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, hospitalBorrado)=>{

        if (err){

            return res.status(500).json({
                ok:false,
                mensaje:'Error al borrar hospital',
                errors: err
            })
        }

        if (!hospitalBorrado){

            return res.status(400).json({
                ok:false,
                mensaje:'No existe hospital con ese id',
                errors: {message: 'No existe un hospital con ese id'}
            })
        }
        res.status(200).json({
            ok: true,
            usuario: hospitalBorrado
        });
    })

});

module.exports = app;