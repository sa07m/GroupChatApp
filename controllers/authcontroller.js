const User = require('../models/user'); 
const path = require('path');
const bcrypt =  require('bcrypt');
const jwt = require('jsonwebtoken');
const Group =require('../models/group');
const GroupUser = require('../models/groupuser');



exports.home = (req,res,next)=>{
    res.sendFile(path.join(__dirname,  '../index.html'));
}

exports.log = (req,res,next)=>{
    res.sendFile(path.join(__dirname,  '../login.html'));
}

exports.signup = async (req,res,next)=>{
    console.log(req.body)
    try{
        const {name,email,password ,phone} = req.body ;
        if(name.length === 0 || name  == null || password == null || email == null || email.length === 0 || password.length === 0){
            res.status(400).json({err : "bad  parameters"})
        }
        const users = await User.findAll({where: {email:email}});
        if(users[0]){
                return res.status(403).json({msg : "User already exists, Please Login"})
        }
        const userss = await User.findAll({where: {phone:phone}});
        if(userss[0]){
                return res.status(403).json({msg : "Phone no. already linked to an account"})
        }

                bcrypt.hash(password , 10 , async ( err , hash)=>{
                    const user = await User.create({name:name , email : email , password : hash , phone:phone})
                    const publicGroup = await Group.findOne({ where: { name: 'public' } });
                    await GroupUser.create({ userId: user.id, groupId: publicGroup.id });
                    res.status(201).json({message : 'signed up successfully'})
                })
                
        
    }catch(err) {
            console.log(err)
            res.status(500).json({"msg" : err});
    }
    
    
}

exports.login = async (req,res,next)=>{
    try{
        const {email,password} = req.body ;
        if( password == null || email == null || email.length === 0 || password.length === 0){
            res.status(400).json({err : "bad  parameters"})
        }
        const users = await User.findAll({where: {email:email }});
        
        if(users[0]){
            const user = users[0];
            bcrypt.compare(password,user.password , async  (err, response )=>{
                if(response == true){
                    const token =  await jwt.sign({ id: user.id , ispremiumuser : user.ispremiumuser }, process.env.TOKEN_SECRET);
                    res.status(200).json({
                        message: 'Login successful',
                        //user: { username: req.body.username  },
                        token : token
                     });
                }else{
                    res.status(401).json({msg : "bad credentials"});
                }
            })
        }else{
            console.log('users' , users);
            res.status(404).json({msg : "user not found"});
        }

    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}