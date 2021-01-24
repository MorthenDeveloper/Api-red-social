'use strict'

var express = require('express');

var CommentController = require('../controllers/comment_controller');

var api = express.Router(); // metodos http
var md_auth = require('../middlewares/authenticated');

var baseEndpoint = '/comments';

// get
api.get(baseEndpoint, md_auth.ensureAuth, CommentController.getComments);
// api.get(baseEndpoint + '/:id', md_auth.ensureAuth, PostController.getPostByUserId);

// post
api.post(baseEndpoint, CommentController.saveComment);

// put
// api.put(baseEndpoint + '/:id', md_auth.ensureAuth, PostController.updatePost);

module.exports = api;