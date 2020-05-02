var express= require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app= express();

var Medico = require('../models/medico');
var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');

//Rutas

app.use(fileUpload());


// app.post('/upload', function(req, res) {
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.status(400).send('No files were uploaded.');
//     }
  
//     // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//     let sampleFile = req.files.sampleFile;
  
//     // Use the mv() method to place the file somewhere on your server
//     sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
//       if (err)
//         return res.status(500).send(err);
  
//       res.send('File uploaded!');
//     });
//   });



app.put('/:tipo/:id', (req, res, next ) => {
    
    var tipo= req.params.tipo;
    var id = req.params.id;

    //tipos de coleccion

    var tiposValidos=['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo)< 0){
        return res.status(400).json({
        
            ok: false,
            mensaje: 'Tipo de colección no es valida',
            errors: { message:'Tipo de colección no es válida'}

        });
    }

    if (!req.files){
        return res.status(400).json({
        
            ok: false,
            mensaje: 'Error no selecciono nada',
            errors: { message:'Debe seleccionar una imagen'}

        });
    }
    
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[ nombreCortado.length -1 ]

    //solo extensiones son validas

    var extensionesValidas =['png','jpg','gif','jpeg', 'JPG', 'PNG', 'GIF','JPEG'];

    if (extensionesValidas.indexOf( extensionArchivo) < 0){
        return res.status(400).json({
        
            ok: false,
            mensaje: 'Extension no válida',
            errors: { message:'Las extensiones validas son' + extensionesValidas.join(', ')}

        });

    }

    //Nombre de archivo personalizado

    var nombreArchivo =`${ id}-${ new Date().getMilliseconds()}.${extensionArchivo}`;

    var path =`./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv (path, err=>{

        if (err){
            return res.status(500).json({
        
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
    
            });

        }

        subirPorTipo (tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje:'Archivo movido correctamente',
        //     nombreCortado: nombreCortado,
        //     extensionArchivo: extensionArchivo
        // });
    })

    

});

function subirPorTipo (tipo, id, nombreArchivo, res){
    if (tipo ==='usuarios'){
        Usuario.findById(id, (err, usuario)=>{
           
            if(!usuario ){

                return res.status(200).json({
                    ok: true,
                    mensaje:'Usuario no existe',
                    errors: {message:'Usuario no existe'}                
                });
            }
           
            var pathViejo = '../uploads/usuarios/' + usuario.img;
            console.log (pathViejo);
            if (fs.existsSync(pathViejo)){
               fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;
            usuario.save ((err, usuarioActualizado)=>{
            usuarioActualizado.password=':)'
            return res.status(200).json({
                    ok: true,
                    mensaje:'Usuario actualizado correctamente',
                    usuario: usuarioActualizado                });
            });
        });
    }
    if (tipo ==='medicos'){
        
       
        Medico.findById(id, (err, medico)=>{
            if(!medico ){

                return res.status(200).json({
                    ok: true,
                    mensaje:'Medico no existe',
                    errors: {message:'Medico no existe'}                
                });
            }
            var pathViejo = '../uploads/medicos/' + medico.img;
            console.log (pathViejo);
            if (fs.existsSync(pathViejo)){
               fs.unlink(pathViejo);
            }

            medico.img = nombreArchivo;
            medico.save ((err, medicoActualizado)=>{
           // usuarioActualizado.password=':)'
            return res.status(200).json({
                    ok: true,
                    mensaje:'Medico actualizado correctamente',
                    medico: medicoActualizado                });
            });
        });
    }
    if (tipo ==='hospitales'){
        Hospital.findById(id, (err, hospital)=>{

            if(!hospital ){

                return res.status(200).json({
                    ok: true,
                    mensaje:'Hospital no existe',
                    errors: {message:'Hospital no existe'}                
                });
            }
            var pathViejo = '../uploads/hospitales/' + hospital.img;
            console.log (pathViejo);
            if (fs.existsSync(pathViejo)){
               fs.unlink(pathViejo);
            }

            hospital.img = nombreArchivo;
            hospital.save ((err, hospitalActualizado)=>{
           // usuarioActualizado.password=':)'
            return res.status(200).json({
                    ok: true,
                    mensaje:'Hospital actualizado correctamente',
                    hsopital: hospitalActualizado                });
            });
        });
    }
}

module.exports = app;