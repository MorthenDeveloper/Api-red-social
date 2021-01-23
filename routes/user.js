'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router(); // metodos http
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' })

api.get('/home', UserController.home); //(path,método a cargar)
api.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);

var baseEndpoint = '/users';

// get
api.get(baseEndpoint + '/:id', md_auth.ensureAuth, UserController.getUser); //compruebo si el usuario autentcado sigue al usuario pasado por parámetro "id"
api.get(baseEndpoint + '/:page?', md_auth.ensureAuth, UserController.getUsers); // paginable
api.get(baseEndpoint + '?seguidores=:id?',md_auth.ensureAuth, UserController.getCounters);   // numero de usuarios seguidos
api.get(baseEndpoint + '?image=:imageFile', UserController.getImageFile);

// post
api.post('/login', UserController.loginUser);   
api.post(baseEndpoint, UserController.saveUser);
api.post(baseEndpoint + '/upload-image/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage); // subir foto

// put
api.put(baseEndpoint + '/:id', md_auth.ensureAuth, UserController.updateUser);

module.exports = api;