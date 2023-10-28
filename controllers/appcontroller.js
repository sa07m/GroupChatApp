const User = require('../models/user')
const { Op } = require('sequelize');
const Group = require('../models/group');
const path = require('path');
const sequelize = require('../util/database');
const Message = require('../models/message')

exports.app = (req,res,next)=>{
    res.sendFile(path.join(__dirname,  '../app.html'));
}

// exports.try = (req,res,next)=>{
//     res.sendFile(path.join(__dirname,  '../try.html'));
// }


exports.send = async(req, res) => {
    try{
        const userId = req.user.id ; 
        const username = req.user.name;
        const message = req.body.message;
        //const msg  = await Message.create({username: username ,message: message , userid : userId })
        const groupName = req.body.groupName;
        const group = await Group.findOne({ where: { name: groupName } });
        if (!group) {
            return res.status(404).json({ success: false, error: 'Group not found' });
        }
        const msg  = await Message.create({username: username ,message: message , userId : userId , groupId : group.id })
        res.status(200).json({message:msg})
    }
    catch(err){
        //console.log(err)
        res.status(400).json({message:"error"})
    }


}

exports.getmessages = async (req, res) => {
    try{
        console.log('in get messages controller')
        const lastMessageId = req.query.lastMessageId;
        //console.log('last message id : ' , lastMessageId) ;
        const groupName = req.params.groupName;
        console.log('groupname', groupName)
        const group = await Group.findOne({ where: { name: groupName } });
        if (!group) {
            return res.status(404).json({ success: false, error: 'Group not found' });
        }
        let messages;
        if (lastMessageId) {
           // messages = await Message.findAll({ where: { id: { [Op.gt]: lastMessageId } } } );
            messages = await Message.findAll({ where: { id: { [Op.gt]: lastMessageId } , groupId: group.id} } );
        }else{
           // messages = await Message.findAll();
            messages = await Message.findAll({where : { groupId: group.id }});
        }
        res.send(messages);
}catch(err){
        console.log(err);
}
}