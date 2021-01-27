'use strict'

var express = require('express');
var MessageController = require('../controllers/message_controller');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

//METODO DE PRUEBA
api.get('/probando-md', md_auth.ensureAuth, MessageController.probando);

//ENVIAR MENSAJE
api.post('/sendmessage', md_auth.ensureAuth, MessageController.saveMessage);

//MENSAJES RECIBIDOS, EL PARAMETRO PAGE ES OPCIONAL
api.get('/my-messages/:page?', md_auth.ensureAuth, MessageController.getReceivedMessages);

//MENSAJES ENVIADOS
api.get('/messages/:page?', md_auth.ensureAuth, MessageController.getEmmitMessages);

//NUMERO DE MENSAJES NO VISTOS
api.get('/unviewed-messages', md_auth.ensureAuth, MessageController.getUnviewedMessages);

//MARCAR MENSAJES COMO LEIDOS
api.get('/set-viewed-messages', md_auth.ensureAuth, MessageController.setViewedMessages);

module.exports = api;