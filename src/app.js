const express = require('express');
const app = express();
var path = require('path');
const router = express.Router();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Rotas
const index = require('./routes/index');
app.use('/', index);
module.exports = app;