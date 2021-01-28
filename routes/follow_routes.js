'use strict'

var express = require('express');
var FollowController = require('../controllers/follow_controller');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var baseEndpoint = '/follows';

//GUARDAR UN SEGUIMIENTO
api.post(baseEndpoint, md_auth.ensureAuth, FollowController.saveFollow);

//ELIMINAR UN SEGUIMIENTO
api.delete(baseEndpoint + '/:id', md_auth.ensureAuth, FollowController.deleteFollow);

// obtener follow by userfollowId
api.get(baseEndpoint + '?userfollow=:id?', md_auth.ensureAuth, FollowController.getFollowByUserFollow);

//OBTENER TODOS LOS USUARIOS A LOS ESTÁ SIGUIENDO EL USUARIO POR PARÁMETRO
api.get('/following/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowingUsers);

//OBTENER LOS USUARIOS QUE NOS SIGUEN
api.get('/followed/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowedUsers);

//OBTENER USUARIOS SIN PAGINAR
api.get('/get-my-follows/:followed?', md_auth.ensureAuth, FollowController.getMyFollows);

module.exports = api;