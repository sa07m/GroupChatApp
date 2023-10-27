const jwt = require('jsonwebtoken')
const express = require('express')
const User = require('../models/user')
exports.authenticate = (req,res,next)=>{
    try{
        const token = req.header('Authorization');
        console.log('token aaya ' , token);
        const user = jwt.verify(token ,process.env.TOKEN_SECRET );
        const userid = user.id;
        console.log('user id mili' , userid);
        console.log('user id : ', userid);
        User.findByPk(userid).then(
            user=>{
                console.log('user mila' , user);
                req.user=user;
                next();
            }
        ).catch(err=> { throw new Error(err)})
    }catch(err){
        console.log(err);
        return res.status(401).json({success:false})
    }
}