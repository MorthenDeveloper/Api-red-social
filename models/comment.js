'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = Schema({
    textComment: String,
    commentDate: String,
    userComment: { type: Schema.ObjectId, ref: 'User' },
    post: { type: Schema.ObjectId, ref: 'Post' }
});

module.exports = mongoose.model('Comment', CommentSchema);