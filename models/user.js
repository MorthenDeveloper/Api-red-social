'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //permite definir los schemas

var UserSchema = Schema({
    name: String,
    surname: String,
    nick: String,
    email: String,
    password: String,
    rol: String,
    image: String
}); //estructura que va a tener todos los objetos

//para poder utilizar el modelo en otros ficheros
module.exports = mongoose.model('User', UserSchema); //(nombre de la entidad,nombre del schema)