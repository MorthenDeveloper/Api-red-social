'use strict'

var jwt = require('jwt-simple');
var moment = require('moment'); //para generar fechas
var secret = 'clave_secreta_red_social';

exports.createToken = function(user) {
    var payload = { //va a contener un objeto con los datos del usuario que se pondrá dentro del token
        sub: user._id, //identificador
        name: user.name,
        surname: user.surname,
        nickname: user.nickname,
        email: user.email,
        roles: user.roles,
        image: user.image,
        iat: moment().unix(), //momento cuando se crea el token
        exp: moment().add(30, 'days').unix //momento a expirar
    }

    return jwt.encode(payload, secret);
};