'use strict'
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// esquema
const User = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        validate: {
            validator: function(value) {
                return value.length >= 3;
            },
            message: 'El nombre debe tener al menos 3 caracteres'
        }
    },
    surname: {
        type: String,
        required: [true, 'El apellido es requerido'],
        validate: {
            validator: function(value) {
                return value.length >= 3;
            },
            message: 'El apellido debe tener al menos 3 caracteres'
        }
    },
    nickname: {
        type: String,
        unique: true,
        required: [true, 'El apellido es requerido'],
        validate: {
            validator: function(value) {
                return value.length >= 3;
            },
            message: 'El apellido debe tener al menos 3 caracteres'
        } 
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es requerido'],
        validate: {
            validator: function(value) {
                var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return pattern.test(value);
            },
            message: '{VALUE} no es un email valido',
          }
    },
    password: {
        type: String,
        required: [true, 'La contrasenia es requerida'],
    },
    roles: {
        type: [String]
    },
    image: {
        type: String
    }
}); 

// indices
User.index({name: 1});
User.index({nick: 1});
User.index({email: 1});

// exporto el modelo
module.exports = mongoose.model('User', User);