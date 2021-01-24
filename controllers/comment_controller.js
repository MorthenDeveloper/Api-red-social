'use strict'

var mongoose=require('mongoose');

var Post=require('../models/post');
var User=require('../models/user');
var Comment=require('../models/comment');

function saveComment(req, res) {
    var params = req.body;
    var comment = new Comment();

    if (params.textComment && params.userCommentId && params.postId) {
        comment.textComment = params.textComment;
        comment.userCommentId = params.userCommentId;
        comment.postId = params.postId;

        comment.save(function(err, post){
            if(err){
                return res.status(500).json({ message: 'Error en la petición' });
            }
            return res.json(post);
        })
    }
}

function getComments(req, res) {
    return Comment.find({}, function(err, posts){
        if (err) {
            return res.status(500).json({ message: 'Error en la petición' });
        }
        return res.json(posts);
    });
}

module.exports = {
    saveComment,
    getComments
}