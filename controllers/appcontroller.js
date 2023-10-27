const User = require('../models/user')
const path = require('path');
const sequelize = require('../util/database');
const Message = require('../models/message')

exports.app = (req,res,next)=>{
    res.sendFile(path.join(__dirname,  '../app.html'));
}

exports.send = async(req, res) => {
    try{
        const message = req.body.message
        const name = req.user.name
        console.log('..>>',message)
        Message.create({message:message,userId:req.user.id})
        res.status(201).json({message:"message added",name})
    }
    catch(err){
        //console.log(err)
        res.status(400).json({message:"error"})
    }


}
