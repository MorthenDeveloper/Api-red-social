'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FollowSchema = Schema({
    user: { 
        type: Schema.ObjectId, ref: 'User',
        required: [true, 'El id de usuario es requerido']
    },
    followed: { 
        type: Schema.ObjectId, ref: 'User',
        required: [true, 'El id de usuario seguido es requerido'], 
    }
});

module.exports = mongoose.model('Follow', FollowSchema);