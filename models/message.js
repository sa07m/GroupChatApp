const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('message' , {
    id : {type : Sequelize.INTEGER , autoIncrement : true, allowNull:false , primaryKey : true },
    
    message :  Sequelize.STRING ,
    username : {type: Sequelize.STRING, allowNull:false } ,
});


module.exports = User;