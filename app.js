'use strict';
const filesystem = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
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

let locationFile = './data/location.csv';
var location_xy =csvToJson.fieldDelimiter(',').getJsonFromCsv(locationFile);
global.location_data = location_xy;

let areaFile = './data/areacode.csv'
var areacode = csvToJson.fieldDelimiter(',').getJsonFromCsv(areaFile);
global.area_data = areacode;

let tmFile = './data/tmFc.csv'
var tmcode = csvToJson.fieldDelimiter(',').getJsonFromCsv(tmFile);
global.tm_data = tmcode;

let tempFile = './data/temperature.json'
var tempcode = filesystem.readFileSync(tempFile);
var tempjson = JSON.parse(tempcode)
global.temp_data = tempjson;

let skyFile = './data/sky.json'
var skycode = filesystem.readFileSync(skyFile);
var skyjson = JSON.parse(skycode);
global.sky_data = skyjson;

let lifeFile = './data/life.json'
var lifecode = filesystem.readFileSync(lifeFile);
var lifejson = JSON.parse(lifecode);
global.life_data = lifejson;

app.set('port', config.server_port);
app.listen(app.get('port'), () => {

  console.info(`Application Listening on Port ${'port'}`);
  });




module.exports=app;
