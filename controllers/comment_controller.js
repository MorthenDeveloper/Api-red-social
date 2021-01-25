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

function getCommentById(req, res) {
    
    var commentId = req.params.id; //los datos que vienen por URL están en params, los datos por post o put es BODY
    
    return Comment.findById(commentId, function(err, comment){
        if (err) {
            return res.status(500).json({ message: 'Error en la petición' });
        }
        return res.json(comment);
    });
}

function getCommentsByPostId(req, res) {
    
    var postId = req.params.postId; //los datos que vienen por URL están en params, los datos por post o put es BODY
    
    return Comment.findByPostId(postId, function(err, comments){
        if (err) {
            return res.status(500).json({ message: 'Error en la petición' });
        }
        return res.json(comments);
    });
}

module.exports = {
    saveComment,
    getComments,
    getCommentById,
    getCommentsByPostId,
}