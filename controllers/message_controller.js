'use strict'
var mongoose = require('mongoose');
var moment = require('moment'); //
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

/**
 * GET: /messages/:idEmitterUser/sent/:idReceiverUser
 */
function getSentOrReceivedMessages(req, res) {
    var idReceiverUser = mongoose.mongo.ObjectId(req.params.idReceiverUser);
    var idEmitterUser = mongoose.mongo.ObjectId(req.params.idEmitterUser);

    return Message.aggregate([
            {$lookup:{from: 'users',localField: 'idEmitterUser',foreignField: '_id',as: 'user'}},
            {$sort:{ created_at : 1 }},
            {$match :
                {$or: [
                    { $and:[{ "idReceiverUser":idReceiverUser }, { "idEmitterUser" :idEmitterUser } ]}, 
                    {$and :[{ "idReceiverUser": idEmitterUser}, { "idEmitterUser" :idReceiverUser  }]}]
                }
            },
            {$project : {idEmitterUser:1,idReceiverUser:1,created_at:1,text:1,name:"$user.name"}}
        ],
        function(err, messages){
        if (err) {
            return res.status(500).json({ message: 'Error en la petición' });
        }
        console.log(messages);
        return res.json(messages);
    });
}

/**
 * POST: /messages
 */
function saveMessage(req, res) {
    var params = req.body;
    var message = new Message();

    if (params.idEmitterUser && params.idReceiverUser && params.text) {
        message.idEmitterUser = params.idEmitterUser;
        message.idReceiverUser = params.idReceiverUser;
        message.text = params.text;
        message.created_at = new Date();

        message.save(function(err, msg){
            if(err){
                return res.status(500).json({ message: 'Error en la petición' });
            }
            return res.json(msg);
        })
    }
}





function probando(req, res) {
    res.status(200).send({ message: 'Hola que tal' })
}


/*
function saveMessage(req, res) {
    var params = req.body;

    if (!params.text || !params.receiver) {
        return res.status(200).send({ message: 'Envía los datos necesarios' })
    } else {

        var message = new Message();
        message.emitter = req.user.sub;
        message.receiver = params.receiver;
        message.text = params.text;
        message.created_at = moment().unix();
        message.viewed = 'false';

        message.save((err, messageStored) => {
            if (err) {
                return res.status(500).send({ message: 'Error en la petición' })
            }
            if (!messageStored) {
                return res.status(500).send({ message: 'Error al enviar el mensaje' })
            } else {
                return res.status(200).send({ message: messageStored });
            }
        });
    }
}
*/


//MENSAJES RECIBIDOS
function getReceivedMessages(req, res) {
    var userId = req.user.sub;

    var page = 1;

    //SI LLEGA EL PARAMETRO POR LA URL
    if (req.params.page) {
        page = req.params.page;
    }
    //MENSAGES POR PÁGINA
    var itemsPerPage = 4;

    Message.find({ receiver: userId }).populate('emitter', 'name surname image nick _id').paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) {
            return res.status(500).send({ message: 'Error en la petición' })
        }
        if (!messages) {
            return res.status(404).send({ message: 'No hay mensajes' })
        } else {
            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemsPerPage),
                messages
            });
        }
    });
}

//LISTAR LOS MENSAJES QUE HEMOS ENVIADO

function getEmmitMessages(req, res) {
    var userId = req.user.sub;

    var page = 1;

    //SI LLEGA EL PARAMETRO POR LA URL
    if (req.params.page) {
        page = req.params.page;
    }
    //MENSAGES POR PÁGINA
    var itemsPerPage = 4;

    Message.find({ emitter: userId }).populate('emitter receiver', 'name surname image nick _id').paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) {
            return res.status(500).send({ message: 'Error en la petición' })
        }
        if (!messages) {
            return res.status(404).send({ message: 'No hay mensajes' })
        } else {
            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemsPerPage),
                messages
            });
        }
    });
}

//NUMERO DE  MENSAJES NO VISTOS
function getUnviewedMessages(req, res) {

    var userId = req.user.sub;

    Message.count({ receiver: userId, viewed: 'false' }).exec((err, count) => {
        if (err) {
            return res.status(500).send({ message: 'Error en la petición' })
        } else {
            return res.status(200).send({
                'unviewed': count
            });
        }
    });
}

//MARCAR MENSAJES COMO LEIDOS
function setViewedMessages(req, res) {
    var userId = req.user.sub;
    //con el multi = true actualiza todos los doc
    Message.updateMany({ receiver: userId, viewed: 'false' }, { viewed: 'true' }, { "multi": true }, (err, messagesUpdated) => {
        if (err) {
            return res.status(500).send({ message: 'Error en la petición' })
        }
        return res.status(200).send({
            messages: messagesUpdated
        });

    });
}



module.exports = {
    probando,
    saveMessage,
    getReceivedMessages,
    getEmmitMessages,
    getUnviewedMessages,
    setViewedMessages,
    getSentOrReceivedMessages
}