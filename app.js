'use strict'

var express = require('express');
var bodyParser = require('body-parser'); //sirve para convertir el body a un objeto de javascript

var app = express(); //instancia de express
const cors = require('cors');
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//cargar rutas
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');


//cargar middlewares, ocurrirá en cada una de las peticiones que se haga a la API
app.use(bodyParser.urlencoded({ extended: false })); //en cada petición se ejecutará este middleware
app.use(bodyParser.json()); //convertir lo del body a JSON

//CORS -CAMBIO 2

//rutas
app.use('/api', user_routes); //permite hacer middleware, quiere decir que a cada petición que se ejecute, el middleware se va a ejecutar antes de llegar al controlador
app.use('/api', follow_routes);

//exportar
module.exports = app;