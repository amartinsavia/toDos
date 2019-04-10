const express = require("express");
const app = express();
const body_parser = require("body-parser");
const path = require('path');
var port = process.env.PORT || 3000;

app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

var toDo = [];

function validarDatos(tarea) {
    var errores = "";
    var patronHora  = /(0[1-9]|1\d|2[0-3]):([0-5]\d)/;
    if ( !tarea.id || tarea.id <= 0 ) {
        errores += "Id debe ser mayor que 0";
    }
    if ( !tarea.title ) {

        errores += "Título no correcto, rellene título";
    }
    if ( !tarea.date ) {

        errores += "Fecha formato incorrecto, debe ser AAAA-MM-DD";
    }
    if ( !tarea.time || !patronHora.test(tarea.time) ) {
        errores += "Hora con formato incorrecto, debe ser HH:MM";
    }       
    return errores;
};

function validarId(tarea){
    var errores = ""; 
    if ( !tarea.id ) {
        errores += "Id debe contener valor";
    }
    return errores;
}

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/front', 'index.html'));
});

app.get('/main.css', function (req, res) {
    res.sendFile(path.join(__dirname, '/front', 'main.css'));
});

app.get('/moment.js', function (req, res) {
    res.sendFile(path.join(__dirname, '/front', 'moment.js'));
});

app.get('/model.js', function (req, res) {
    res.sendFile(path.join(__dirname, '/front', 'model.js'));
});

app.get('/todos', function (req, res) {
    res.send(toDo);
});

app.post('/newTask', function (req, res) {
    var errores = validarDatos(req.body)
    if ( errores ) {        
        toDo.push(req.body.task);
        res.send();
    } else {
        res.status(400).send(errores)
    }
   
});

app.delete('/byeTask/:id', function (req, res) {
    for (var i = 0; i < toDo.length; i++) {
        if (toDo[i].id === req.params.id) {
            toDo.splice(i, 1);
        }
    }
    res.send();
});

app.put('/tick/:id', function (req, res) {
    var errores = validarId(req.body.task)
    if ( errores ) {
        res.status(400).send(errores)
    }else {
        for (var i = 0; i < toDo.length; i++) {
            if (toDo[i].id == req.params.id) {
                toDo[i].done = true;
            }
        }        
        res.send();
    }
});

app.put('/task/:id', function (req, res) {
    var errores = validarDatos(req.body)
    if ( errores ) {
        res.status(400).send(errores)
    } else {
        for (var i = 0; i < toDo.length; i++) {
            if (toDo[i].id === req.params.id) {
                toDo.splice(i, 1, req.body);
                toDo[i].done = false;
            }
        }        
        res.send();
    }
});

app.listen(port, function() {
    console.log("El servidor está inicializado en el puerto 3000");
});
