'use strict'

var express = require('express');
var MessageController = require('../controllers/message_controller');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var baseEndpoint = '/messages';

api.post(baseEndpoint, md_auth.ensureAuth, MessageController.saveMessage);
api.get(baseEndpoint + '/:idEmitterUser/sent/:idReceiverUser', md_auth.ensureAuth, MessageController.getSentOrReceivedMessages);
api.get(baseEndpoint + '/:idReceiverUser/received/:idEmitterUser', md_auth.ensureAuth, MessageController.getSentOrReceivedMessages);


//MENSAJES RECIBIDOS, EL PARAMETRO PAGE ES OPCIONAL
api.get('/my-messages/:page?', md_auth.ensureAuth, MessageController.getReceivedMessages);

//METODO DE PRUEBA
api.get('/probando-md', md_auth.ensureAuth, MessageController.probando);

//MENSAJES ENVIADOS
api.get('/messages/:page?', md_auth.ensureAuth, MessageController.getEmmitMessages);

//NUMERO DE MENSAJES NO VISTOS
api.get('/unviewed-messages', md_auth.ensureAuth, MessageController.getUnviewedMessages);

//MARCAR MENSAJES COMO LEIDOS
api.get('/set-viewed-messages', md_auth.ensureAuth, MessageController.setViewedMessages);

module.exports = api;