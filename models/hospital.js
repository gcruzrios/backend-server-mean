var mongoose = require('mongoose');



var Schema = mongoose.Schema;




var hospitalSchema= new Schema({
  
        nombre:{ type:String, required:[true, 'El nombre es necesario'] },
        img:{ type:String, required:false},
        usuario:{ type:Schema.Types.ObjectId, ref:'Usuario'}
    },
    { collection:'hospitales'});
      
      
    module.exports= mongoose.model('Hospital', hospitalSchema);
      
    //   Tip:Un tema que no vimos hasta el momento, es que el usuario es de tipo Schema.Types.ObjectId,
    //    esto es utilizado para indicarle a Mongoose, que ese campo es una relación con otra colección, 
    //    y la referencia es Usuario.Al final este campo nos dirá quéusuario creó el registro.
    //    Se guarda únicamente el usuario._id en ese campo. Es todo.Otro tema que no vimos, esla parte de 
    //    { collection: ‘hospitales’}esto simplemente es para evitar que Mongoose coloque el nombre a la
    //     coleccióncomo hospitals.
