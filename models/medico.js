var mongoose= require('mongoose');
var Schema = mongoose.Schema;

var medicoSchema=  new Schema({

    nombre:{ type:String, required:[true, 'El nombre es necesario'] },
    img:{ type:String, required:false},
    usuario:{ type:Schema.Types.ObjectId, ref:'Usuario', required:true},
    hospital:{ type:Schema.Types.ObjectId, ref:'Hospital', required:[true, 'El id hospital es un campo obligatorio'] }

 },
 { collection:'medicos'});
 module.exports= mongoose.model('Medico', medicoSchema);
 
 
//  Tip:Como pueden observar, este esquema requiere el usuario que lo creo, como un hospital...estas únicamente son los _id
//  para manejar la relación entre el usuario que lo creo y el hospital al que estamos queriendo asignar al médico.
