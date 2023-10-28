require('dotenv').config()
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const sequelize = require('./util/database');
const authroutes = require('./routes/authroutes');
const approutes = require('./routes/approutes')
const User = require('./models/user');
const Message = require('./models/message')
const Group = require('./models/group');
const GroupUser = require('./models/groupuser');


const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use(authroutes);
app.use(approutes)

User.hasMany(Message);
Group.hasMany(Message);
Message.belongsTo(User);
Message.belongsTo(Group);
User.belongsToMany(Group , {through  :  GroupUser});
Group.belongsToMany(User , {through  :  GroupUser});

Group.findOrCreate({ where: { name: 'public' } })
    .then(([group, created]) => {
        if (created) {
            console.log('Public group created');
        } else {
            console.log('Public group already exists');
        }
    })
    .catch(err => console.log(err));

//sequelize.sync({force:true})
sequelize.sync()

.then(() => {
    return Group.findOrCreate({ where: { name: 'public' } });
})
.then(([group, created]) => {
    if (created) {
        console.log('Public group created');
    } else {
        console.log('Public group already exists');
    }
    return app.listen(process.env.PORT || 3000);
})
.catch(err=> console.log(err));