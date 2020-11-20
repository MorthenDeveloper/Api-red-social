'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    text: String,
    file: String,
    created_at: String,
});

module.exports = mongoose.model('Post', PostSchema); //(nombre de la entidad,nombre del schema)