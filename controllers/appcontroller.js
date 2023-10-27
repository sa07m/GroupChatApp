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

exports.getmessage = async (req, res) => {
    try{
        
        const result = await Message.findAll({
            attributes:['message'],
            include: [
              {
                model: User,
                attributes: ['name'], // Include only the 'userName' attribute from the User model
              },
            ],
          })
        //   const stringresult = JSON.stringify(result)
        //   console.log(stringresult)
        res.status(200).json(result)
    }
    catch(err){
        console.log(err)
    }

}


