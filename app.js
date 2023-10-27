require('dotenv').config()
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const sequelize = require('./util/database');
const authroutes = require('./routes/authroutes');
const User = require('./models/user');


const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use(authroutes);

//sequelize.sync({force:true})
sequelize.sync()
.then(()=>{
    app.listen(process.env.PORT || 3000);
})
.catch(err=> console.log(err));