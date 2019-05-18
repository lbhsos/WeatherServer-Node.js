'use strict';

const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-Parser');
const path = require('path');
const app = express();
const config = require('./config');
const database = require('./database/database');
const csvToJson = require('convert-csv-to-json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
require('./routes')(app);


database.init(app,config);
console.log('config.server_port : %d', config.server_port);

let locationFile = './location.csv';
var location_xy =csvToJson.fieldDelimiter(',').getJsonFromCsv(locationFile);
global.location_data = location_xy;
let areaFile = './areacode.csv'
var areacode = csvToJson.fieldDelimiter(',').getJsonFromCsv(areaFile);
global.area_data = areacode;
let tmFile = './tmFc.csv'
var tmcode = csvToJson.fieldDelimiter(',').getJsonFromCsv(tmFile);
global.tm_data = tmcode;

app.set('port', config.server_port);
app.listen(app.get('port'), () => {

  console.info(`Application Listening on Port ${'port'}`);
  });




module.exports=app;
