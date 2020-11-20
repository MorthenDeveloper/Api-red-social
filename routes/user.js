'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router(); //para tener acceso a los métodos get, post, put, delete, etc
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' })

api.get('/home', UserController.home); //(path,método a cargar)
api.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);
//GUARDAR USUAARIOS
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser); //comprobamos si el usuario autentcado sigue al usuario pasado por parámetro "id"
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);
//OBTENER LA CANTIDAD DE USUARIOS QUE SEGUIMOS Y LOS QUE NOS SIGUEN
api.get('/counters/:id?',md_auth.ensureAuth, UserController.getCounters);
//MODIFICAR USUARIO
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
//SUBIR IMAGEN DE USUARIO
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
//OBTENER LA IMAGEN DEL USUARIO
api.get('/get-image-user/:imageFile', UserController.getImageFile);


module.exports = api;