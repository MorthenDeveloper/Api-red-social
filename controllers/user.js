'use strict'

var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs'); //permite trabajar con archivos
var path = require('path'); //permite trabajar con rutas de ficheros

var User = require('../models/user');
var Follow = require('../models/follow');
var jwt = require('../services/jwt');
const { exists } = require('../models/user');
const follow = require('../models/follow');
const user = require('../models/user');
const { count } = require('console');

//MÉTODOS DE PRUEBA
function home(req, res) {
    res.status(200).send({
        message: 'Hola Mundo'
    });
};
//MÉTODOS DE PRUEBA
function pruebas(req, res) {
    res.status(200).send({
        message: 'Test action'
    });
}

//REGISTRO
function saveUser(req, res) {
    var params = req.body; //para recoger los parámetros de la request(los campos que lleguen por post)
    var user = new User(); //creamos un objeto del modelo

    if (params.name && params.surname && params.nickname && params.email && params.password) {
        user.name = params.name;
        user.surname = params.surname;
        user.nickname = params.nickname;
        user.email = params.email;
        user.roles = params.roles;
        user.image = null;

        //CONTROLAR USUARIOS DUPLICADOS,
        User.find({
            $or: [
                { email: user.email.toLowerCase() }, //si el email ya existe en la bd
                { nickname: user.nickname.toLowerCase() } //si el nickname ya existe en la bd
            ]
        }).exec((err, users) => {
            if (err) { //si existe algún error
                return res.status(500).send({ message: 'Error en la petición del usuarios' })
            }
            if (users && users.length >= 1) { //existen los usuarios repetidos
                return res.status(200).send({ message: 'El usuario que intenta registrar, ya existe' })
            } else {
                //CIFRAR EL PASSWORD Y GUARDAR LOS DATOS
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;
                    user.save((err, userStored) => { //error,usuario guardado en la bd
                        if (err) {
                            return res.status(500).send({
                                message: 'Error al guardar el usuario'
                            });
                        }
                        if (userStored) { //si el usuario llega correctamente
                            res.status(200).send({
                                user: userStored //devuelve todo el usuario enviado
                            });
                        } else {
                            res.status(404).send({
                                message: 'No se ha podido registrar el usuario'
                            });
                        }
                    });
                });
            }
        });

    } else {
        res.status(200).send({
            message: 'Envía todos los campos necesarios!!'
        });
    }
}

//LOGIN
function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({ email: email }, (err, user) => {
        if (err) {
            return res.status(500).send({ message: 'Error en la petición' });
        }
        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                    if (check) { //si es correcto

                        if (params.gettoken) {
                            //generar y devolver token
                            return res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            //devolver datos de usuario
                            //no devolveremos el password
                            user.password = undefined;
                            return res.status(200).send({ user });
                        }
                    } else {
                        return res.status(404).send({ message: 'El usuario no se ha podido identificar' });
                    }
                }) //password por parámetro, password en la bd
        } else {
            return res.status(404).send({ message: 'El usuario no se ha podido identificar!!' });
        }
    });
}

//conseguir datos de un usuario
function getUser(req, res) {
    var userId = req.params.id; //los datos que vienen por URL están en params, los datos por post o put es BODY

    User.findById(userId, (err, user) => { //error, usuario que va a devolver la consulta
        if (err) {
            return res.status(500).send({ message: 'Error en la petición' })
        }
        if (!user) {
            return res.status(404).send({ message: 'El usuario no existe' })
        }else{
            followThisUser(req.user.sub,userId).then((value)=>{
                user.password=undefined;
                return res.status(200).send({ 
                    user,
                    following:value.following,
                    followed:value.followed
                 }); 
            });
        }
            
    });

}

async function followThisUser(identity_user_id,user_id){
    
    //DEVUELVE SI EL USUARIO AUTENTICADO ESTÁ SIGUIENDO AL USUARIO POR PARÁMETRO(user_id)
    var following=await Follow.findOne({"user":identity_user_id,"followed":user_id}).exec().then((follow)=>{
        return follow;
    }).catch((err)=>{
        return handleError(err);
    });


    //DEVUELVE SI EL USUARIO user_id, SIGUE AL USUARIO identity_user_id
    var followed=await Follow.findOne({"user":user_id,"followed":identity_user_id}).exec().then((follow)=>{
        return follow;
    }).catch((err)=>{
        return handleError(err);
    });

    return{
        following:following,
        followed:followed
    }
}

//Devolver un listado de usuarios paginado
function getUsers(req, res) {
    //va a listar los usuarios que están en la red social
    var identity_user_id = req.user.sub; //id del usuario logeado

    var page = 1;
    if (req.params.page) { //comrpobar que nos llega por la pag la página
        page = req.params.page;
    }

    var itemsPerPage = 5; //cantidad de usuarios que se van a mostrar por página

    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => { //página actual,cantidad de registros por página
        if (err) {
            return res.status(500).send({ message: 'Error en la petición' });
        }
        if (!users) {
            return res.status(404).send({ message: 'No hay usuarios disponibles' });
        } else {
            followUserIds(identity_user_id).then((value)=>{
                return res.status(200).send({
                    users, //users:users ->lo mismos
                    user_following:value.following,//usuarios que estoy siguiendo
                    user_follow_me:value.followed,//usuarios que me siguen
                    total,
                    pages: Math.ceil(total / itemsPerPage) //paginas totales
                });
            });           
        }
    });
}

//DEOVLVER LOS USUARIOS QUE SEGUIMOS Y LOS QUE NOS SIGUEN
async function followUserIds(user_id){

    //USUARIO QUE SIGUE
    var following=await Follow.find({"user":user_id}).select({'_id':0,'_v':0,'user':0}).exec().then((follows)=>{
        var follows_clean=[];

        follows.forEach((follow)=>{
            follows_clean.push(follow.followed);
        });

        return follows_clean;

    }).catch((err)=>{
        return handleError(err);
    });

    //USUARIO SEGUIDO
    var followed=await Follow.find({"followed":user_id}).select({'_id':0,'_v':0,'followed':0}).exec().then((follows)=>{
        var follows_clean=[];

        follows.forEach((follow)=>{
            follows_clean.push(follow.user);
        });

        return follows_clean;

    }).catch((err)=>{
        return handleError(err);
    });

    return{
        following:following,
        followed:followed
    }
}

//CONTAR USUARIOS QUE SEGUIMOS, QUE NOS SIGUEN

function getCounters(req,res){

    var userId=req.user.sub
    if(req.params.id){
        userId=req.params.id;
    }

    getCountFollow(userId).then((value)=>{
        return res.status(200).send(value);
    });
 
}


async function getCountFollow(user_id){
    
    
    //USUARIOS QUE ESTAMOS SIGUIENDO
    var following=await Follow.count({"user":user_id}).exec().then((count)=>{
        return count;
    }).catch((err)=>{
        return handleError(err);
    });

    //USUARIOS QUE NOS SIGUEN
    var followed=await Follow.count({"followed":user_id}).exec().then((count)=>{
        return count;
    }).catch((err)=>{
        return handleError(err);
    });

    return{
        following:following,
        followed:followed
    }
    
}

//ACTUALIZAR UN USUARIO
function updateUser(req, res) {

    var userId = req.params.id;
    var update = req.body;


    //borrar la propiedad password
    delete update.password; //borra la propiedad password del objeto

    if (userId != req.user.sub) { //Si userId de la URL es diferente al del usuario autenticado
        return res.status(500).send({ message: 'No tienes permiso para actualizar los datos del usuario' });
    }

    User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => { //para que nos devuelva el objeto actualizado {new:true}
        if (err) {
            return res.status(500).send({ message: 'Error en la peticion' });
        }
        if (!userUpdated) {
            return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
        } else {
            return res.status(200).send({ user: userUpdated });
        }
    });

}
//SUBIR ARCHIVOS DE IMAGEN/AVATAR DE USUARIO
function uploadImage(req, res) {
    var userId = req.params.id;

    if (req.files) {
        var file_path = req.files.image.path;
        console.log(file_path);
        var file_split = file_path.split('\\'); //cortar la dirección
        console.log(file_split);
        var file_name = file_split[2];
        console.log(file_name);

        var ext_split = file_name.split('\.');
        console.log(ext_split);
        var file_ext = ext_split[1];
        console.log(file_ext);

        if (userId != req.user.sub) { //Si userId de la URL es diferente al del usuario autenticado
            return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar los datos del usuario');
        }

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            //Actualizar documento de usuario logueado
            User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, userUpdated) => {
                if (err) {
                    return res.status(500).send({ message: 'Error en la peticion' });
                }
                if (!userUpdated) {
                    return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                } else {
                    return res.status(200).send({ user: userUpdated });
                }
            })

        } else {
            //en caso la extensión sea mala
            return removeFilesOfUploads(res, file_path, 'Extensión no válida');
        }

    } else {
        return res.status(200).send({ message: 'No se han subido imagenes' });
    }
}

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => { //unlink para eliminar - borrado de fichero
        return res.status(200).send({ message: message });
    });
}

function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './uploads/users/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) { //si existe
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la imagen' });
        }
    })
}


//para exportar las funciones
module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile,
    getCounters
}