'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_red_social';

exports.ensureAuth = function(req, res, next) { //datos recibidos de la petición, respuesta, funcion para saltar del middleware
    if (!req.headers.authorization) { //cabecera llamada authorization
        return res.status(403).send({ message: 'La petición no tiene la cabecera de autenticación' });
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                message: 'El token ha expirado'
            });
        }
    } catch (error) {
        return res.status(404).send({
            message: 'El token no es válido'
        });
    }

    req.user = payload; //adjuntar el payload a la request para tener siempre los datos del usuario logeado

    next(); //para saltar a lo siguiente, entonces ejecutará la acción del controlador

}