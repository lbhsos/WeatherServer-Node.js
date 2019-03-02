'use strict';

const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-Parser');
const path = require('path');
const app = express();
const config = require('./config');
const database = require('./database/database');
//export 단위체로 객체에 해당  

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
require('./routes')(app);


database.init(app,config);
console.log('config.server_port : %d', config.server_port);
app.set('port', config.server_port);
app.listen(app.get('port'), () => {

  console.info(`[YaTa] Application Listening on Port ${'port'}`);
  });




module.exports=app;
