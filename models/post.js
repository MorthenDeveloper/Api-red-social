'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = Schema({
    user_id: {
        type: Schema.ObjectId, ref: 'User',
        required: [true, 'El objeto usuario es requerido'],
    },
    text: {
        type: String,
        required: [true, 'El texto de la publicacion es requerido'],
    },
    file: {
        type: String
    },
    created_at: {
        type: String
    }
});

// Post.index({user: 1});

module.exports = mongoose.model('Post', PostSchema); //(nombre de la entidad,nombre del schema)