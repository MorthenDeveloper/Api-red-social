'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = Schema({
    idEmitterUser: {
         type: Schema.ObjectId, ref: 'User' 
        },
    idReceiverUser: {
         type: Schema.ObjectId, ref: 'User'
         },
    text: String,
    created_at: String,
    viewed: String //si el mensaje ha sido visto o no 
});

module.exports = mongoose.model('Message', MessageSchema);