'use strict'

var mongoose=require('mongoose');

var Post=require('../models/post');
var User=require('../models/user');

function savePost(req, res) {
    var params = req.body;
    var post = new Post();

    if (params.user_id && params.text) {
        post.user_id = params.user_id;
        post.text = params.text;

        post.save(function(err, post){
            if(err){
                return res.status(500).json({ message: 'Error en la petición' });
            }
            return res.json(post);
        })
    }
}

function getPosts(req, res) {
    return Post.find({}, function(err, posts){
        if (err) {
            return res.status(500).json({ message: 'Error en la petición' });
        }
        return res.json(posts);
    });
}

module.exports = {
    savePost,
    getPosts
}