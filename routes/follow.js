'use strict'

var express = require('express');
var FollowController = require('../controllers/follow');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

//GUARDAR UN SEGUIMIENTO
api.post('/follow', md_auth.ensureAuth, FollowController.saveFollow);
//ELIMINAR UN SEGUIMIENTO
api.delete('/follow/:id', md_auth.ensureAuth, FollowController.deleteFollow);
//OBTENER TODOS LOS USUARIOS A LOS ESTÁ SIGUIENDO EL USUARIO POR PARÁMETRO
api.get('/following/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowingUsers);
//OBTENER LOS USUARIOS QUE NOS SIGUEN
api.get('/followed/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowedUsers);
//OBTENER USUARIOS SIN PAGINAR
api.get('/get-my-follows/:followed?', md_auth.ensureAuth, FollowController.getMyFollows);


module.exports = api;