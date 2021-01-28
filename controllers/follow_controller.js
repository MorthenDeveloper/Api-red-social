'use strict'

var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');

//GUARDAR UN SEGUIMIENTO
function saveFollow(req, res) {

    var params = req.body; //los que vengan por POST

    var follow = new Follow();
    follow.user = req.user.sub; //el usuario que sigue
    follow.followed = params.followed; //el usuario que se va a seguir, el que se pasa por POST

    follow.save((err, followStored) => { //error, documento guardado
        if (err) {
            return res.status(500).json({ message: 'Error al guardar el seguimiento' });
        }
        if (!followStored) {
            return res.status(404).json({ message: 'El seguimiento se ha guardado' });
        } else {
            return res.status(200).json({ follow: followStored }); //propiedad,follow guardado(objeto)
        }
    })
}

//ELIMINAR SEGUIMIENTO
function deleteFollow(req, res) {

    var userId = req.user.sub;
    var followId = req.params.id; //se va a pasar por la URL el id de usuario a dejar de seguir

    Follow.find({ 'user': userId, 'followed': followId }).remove(err => {
        if (err) {
            return res.status(500).send({ message: 'Error al dejar de seguir' });
        } else {
            return res.status(200).send({ message: 'El follow se ha eliminado' });
        }
    })
}

//LISTAR USUARIOS QUE SEGUIMOS (PAGINADO)
function getFollowingUsers(req, res) {
    var userId = req.user.sub;

    if (req.params.id && req.params.page) { //en el caso de que venga por URL el id
        userId = req.params.id;
    }

    var page = 1;
    if (req.params.page) { //en el caso de que venga por URL la página
        page = req.params.page;
    } else {
        page = req.params.id;
    }

    var itemPerPage = 4; //items por página, listar 4 usuarios seguidos por página

    Follow.find({ user: userId }).populate({ path: 'followed' }).paginate(page, itemPerPage, (err, follows, total) => {
        if (err) {
            return res.status(500).send({ message: 'Error en el servidor' });
        }
        if (!follows) {
            return res.status(404).send({ message: 'No se está siguiendo a otros usuarios' });
        } else {
            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemPerPage),
                follows
            })
        }
    }); //buscar todos los objetos donde yo sea el que sigue a los usuarios
    //path:campo que se quiere sustituir por el objeto al que se quiere hacer referencia
    //ahora para cambiar el objectId guardado del followed por el documento original (parecido a un inner join)


}

//LISTAR LOS USUARIOS QUE NOS SIGUEN
function getFollowedUsers(req, res) {

    var userId = req.user.sub;

    if (req.params.id && req.params.page) { //en el caso de que venga por URL el id
        userId = req.params.id;
    }

    var page = 1;
    if (req.params.page) { //en el caso de que venga por URL la página
        page = req.params.page;
    } else {
        page = req.params.id;
    }

    var itemPerPage = 4; //items por página, listar 4 usuarios seguidos por página

    Follow.find({ followed: userId }).populate('user').paginate(page, itemPerPage, (err, follows, total) => {
        if (err) {
            return res.status(500).send({ message: 'Error en el servidor' });
        }
        if (!follows) {
            return res.status(404).send({ message: 'No te sigue ningún usuario' });
        } else {
            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemPerPage),
                follows
            })
        }
    }); //buscar todos los objetos donde yo sea el que sigue a los usuarios
    //path:campo que se quiere sustituir por el objeto al que se quiere hacer referencia
    //ahora para cambiar el objectId guardado del followed por el documento original (parecido a un inner join)
}

//DEVOLVER LISTA DE USUARIOS
function getMyFollows(req,res) {
    var userId = req.user.sub;

    var find = Follow.find({ user: userId }); //si no hay parámetro, devolver los usuarios que yo sigo

    if (req.params.followed) {
        find = Follow.find({ followed: userId }); //devolver usuarios que me están siguiendo
    }

    find.populate('followed').exec((err, follows) => {
        if (err) {
            return res.status(500).send({ message: 'Error en el servidor' });
        }
        if (!follows) {
            return res.status(404).send({ message: 'No te sigue ningún usuario' });
        } else {
            return res.status(200).send({
                follows
            });
        }
    });
}

function getFollowByUserFollow(req, res) {
    var followId = req.params.id; //los datos que vienen por URL están en params, los datos por post o put es BODY
    
    return Follow.findByFollowed(followId, function(err, follow){
        if (err) {
            return res.status(500).json({ message: 'Error en la petición' });
        }
        return res.json(follow);
    });
}

module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows,
    getFollowByUserFollow
}