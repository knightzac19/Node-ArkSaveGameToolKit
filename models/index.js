'use strict';

var fs = require('fs');
var path = require('path');
const Sequelize = require('sequelize');
var basename = path.basename(__filename);
var db = {};

// if (config.use_env_variable) {
//   var sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   var sequelize = new Sequelize(config.database, config.username, config.password, config);
// }
let options =  {
  host: process.env.DBHOST || 'localhost',
  dialect: 'postgres',
  pool: {
   max: 20,
   min: 1,
   acquire: 30000,
   idle: 10000
 }
};
if(process.argv[2] !== 'test') {
  options.logging = false;
}
const sequelize = new Sequelize(process.env.PGDATABASE || 'arkdata', process.env.PGUSER || 'postgres', process.env.PGPASSWORD || '',options);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
