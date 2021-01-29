'use strict'

var express = require('express');

var PostController = require('../controllers/post_controller');

var api = express.Router(); // metodos http
var md_auth = require('../middlewares/authenticated');

var baseEndpoint = '/posts';

// get
api.get(baseEndpoint, md_auth.ensureAuth, PostController.getPosts);
api.get(baseEndpoint + '/user/:userId', md_auth.ensureAuth, PostController.getPostByUserId);

// post
api.post(baseEndpoint, PostController.savePost);

// put
// api.put(baseEndpoint + '/:id', md_auth.ensureAuth, PostController.updatePost);

module.exports = api;