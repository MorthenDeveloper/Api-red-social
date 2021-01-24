'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = Schema({
    textComment: {
        type: String,
        required: [true, 'El comentario es requerido'],
    },
    commentDate: {
        type: String,
    },
    userCommentId: { 
        type: Schema.ObjectId, ref: 'User',
        required: [true, 'El id del usuario que realiza el comentario es requerido'],
    },
    postId: { 
        type: Schema.ObjectId, ref: 'Post',
        required: [true, 'El id del post comentado es requerido'],
    }
});

module.exports = mongoose.model('Comment', CommentSchema);