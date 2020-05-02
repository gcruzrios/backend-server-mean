var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

/******************************** */
/* Middleware Verificar Token
/****************************** */

exports.verificaToken = function (req, res, next){
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded)=> {

        if(err){

            return res.status(401).json({
                ok:false,
                mensaje:'Error al buscar usuario no autorizado, Token Incorrecto',
                errors: err
            })

        }
        req.usuario = decoded.usuario;
        next();
        // res.status(200).json({
        //     ok:false,
        //     decoded: decoded
        
        // });
    });
}
